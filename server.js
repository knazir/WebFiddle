/* * * * * * * * *
 * Dependencies  *
 * * * * * * * * */
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const slash = require("express-slash"); // Middleware to enforce trailing slashes, important for serving projects
const mime = require("mime"); // For determining MIME type of project files
const auth = require("./res/google-auth.js");


/* * * * * * * * * * * * *
 * Express Server Setup  *
 * * * * * * * * * * * * */
const app = express();
const jsonParser = bodyParser.json();

app.enable("strict routing");
app.use(express.static("public"));
app.use(jsonParser);
app.use(cors({ origin: /https?:\/\/(.*\.cs193xfiddle\.herokuapp\.com|localhost)(:[0-9]+)?/i, credentials: true }));

const router = express.Router({
  strict: app.get("strict routing")
});

// Auth
app.use(async function(req, res, next) {
  if (req.body.idToken) {
    req.userInfo = await auth.validateToken(req.body.idToken);
  }
  next();
});

app.use(router);
app.use(slash());


/* * * * * * * * *
 * MongoDB Setup *
 * * * * * * * * */
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
let db = null;
let users = null;
let projects = null;


/* * * * * * * * *
 * Start Server  *
 * * * * * * * * */
async function main() {
  const DATABASE_NAME = "cs193x-db";
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
  users = db.collection("users");
  projects = db.collection("projects");

  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
}

main();

////////////////////////////////////////////////////////////////////////////////

/* * * * * * * * * * *
 * Helper Functions  *
 * * * * * * * * * * */
async function authorized(req) {
  const username = req.params.username || req.body.username;
  return req.userInfo && username === req.userInfo.email;
}

function caseInsensitive(phrase) {
  return {
    $regex: new RegExp(phrase, "i")
  };
}

function legalProjectName(projectName) {
  return /^[a-zA-Z0-9]+$/.test(projectName);
}

function createProject(username, projectName, files) {
  return {
    username: username,
    name: projectName,
    createDate: new Date(),
    files: files
  };
}

function createFile(filename, type) {
  return {
    filename: filename,
    type: type,
    contents: ""
  };
}

function getFilenameWithExtension(filename, type) {
  if (type === "html" && !filename.endsWith(".html")) {
    return filename + ".html";
  } else if (type === "css" && !filename.endsWith(".css")) {
    return filename + ".css";
  } else if (type === "js" && !filename.endsWith(".js")) {
    return filename + ".js";
  } else {
    return filename;
  }
}

function createIndexFile(useStarterCode) {
  const index = {
    type: "html",
    filename: "index.html",
    contents: ""
  };

  if (useStarterCode) {
    index.contents = fs.readFileSync("res/boilerplate.html").toString("utf-8");
  }

  return index;
}

function createCSSFile() {
  return {
    type: "css",
    filename: "main.css",
    contents: ""
  }
}

function createJSFile(id) {
  return {
    type: "js",
    filename: "app.js",
    contents: ""
  }
}


/* * * * * * * *
 * API Routes  *
 * * * * * * * */

/*
 * Get a user object without any file contents.
 */
router.post("/users/signin", async function(req, res) {
  if (!req.body.username) return res.status(400).json({response: "Please specify a username."});
  const username = req.body.username.toLowerCase();

  let user = await users.findOne({ username });

  // Create an account if none exists
  if (!user) {
    await users.insertOne({ username });
    user = await users.findOne({ username });
  }
  let userProjects = await projects.find({ username }).toArray();

  userProjects.forEach(project => delete project.files);
  user.projects = userProjects;
  res.json(user);
});

/*
 * Get a project object including its file contents.
 */
router.get("/users/:username/projects/:projectName", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();

  const project = await projects.findOne({username: username, name: caseInsensitive(req.params.projectName)});
  if (!project) return res.status(400).json({response: `Project "${req.params.projectName}" does not exist.`});

  res.json(project);
});

/*
 * Get a single file from a project by its name.
 */
router.get("/users/:username/projects/:projectName/files/:filename", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();

  const project = await projects.findOne({username: username, name: caseInsensitive(req.params.projectName)});
  if (!project) return res.status(400).json({response: `Project "${req.params.projectName}" does not exist.`});

  let file = project.files.filter(file => file.filename === req.params.filename)[0];
  if (!file) return res.status(400).json({response: `File "${req.params.filename}" does not exist.`});

  res.json(file);
});

/*
 * Create a new project.
 */
router.post("/users/:username/projects/create", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();
  if (!req.body.projectName) return res.status(400).json({response: "Please specify a project name."});
  if (!legalProjectName(req.body.projectName)) {
    return res.status(400).json({response: "Project name may only contain letters, numbers, and spaces."})
  }

  const existingProject = await projects.findOne({username: username, name: caseInsensitive(req.body.projectName)});
  if (existingProject) return res.status(400).json({response: `Project "${req.body.projectName}" already exists.`});

  let files = [createIndexFile(req.body.useStarterCode)];
  if (req.body.useStarterCode) {
    files.push(createCSSFile());
    files.push(createJSFile());
  }

  const newProjectInsert = await projects.insertOne(createProject(username, req.body.projectName, files));
  const newProject = await projects.findOne({_id: newProjectInsert.insertedId});

  res.json(newProject);
});

/*
 * Rename a project.
 */
router.post("/users/:username/projects/rename", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();
  if (!req.body.projectName) res.status(400).json({response: "Please specify a project name."});

  const project = await projects.findOne();
  if (!project) return res.status(400).json({response: `Project ${req.body.projectName} does not exist.`});

  const existingProject = await projects.findOne({ username: username, name: caseInsensitive(req.body.newProjectName)});
  if (existingProject) return res.status(400).json({response: `Project "${req.body.newProjectName}" already exists.`});

  project.name = req.body.newProjectName;
  await projects.update({username: username, name: caseInsensitive(req.body.projectName)}, project);

  res.json({response: "Success"});
});

/*
 * Delete a project.
 */
router.post("/users/:username/projects/delete", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();
  if (!req.body.projectName) return res.status(400).json({response: "Please specify a project name."});

  await projects.deleteOne({username: username, name: caseInsensitive(req.body.projectName)});

  res.json({response: "Success"});
});

/*
 * Update the contents of a file for a project.
 */
router.post("/users/:username/projects/:projectName/files/:filename/update", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();

  const project = await projects.findOne({username: username, name: caseInsensitive(req.params.projectName)});
  if (!project) return res.status(400).json({response: `Project ${req.params.projectName} does not exist.`});

  const file = project.files.filter(file => file.filename === req.params.filename)[0];
  if (!file) return res.status(400).json({response: `File "${req.params.filename}" does not exist!`});

  file.contents = req.body.contents;
  await projects.update({username: username, name: caseInsensitive(req.params.projectName)}, project);

  res.json({response: "Success"});
});

/*
 * Create a file in a project.
 */
router.post("/users/:username/projects/:projectName/files/create", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();
  if (!req.body.filename) return res.status(400).json({response: "Please specify a filename."});
  if (!req.body.type) return res.status(400).json({response: "Please specify a file type."});
  const filename = getFilenameWithExtension(req.body.filename, req.body.type);

  const project = await projects.findOne({username: username, name: caseInsensitive(req.params.projectName)});
  if (!project) return res.status(400).json({response: `Project ${req.params.projectName} does not exist.`});

  const existingFile = project.files.filter(file => file.filename === filename)[0];
  if (existingFile) return res.status(400).json({response: `File "${filename}" already exists.`});

  const newFile = createFile(filename, req.body.type);
  project.files.push(newFile);
  await projects.update({username: username, name: caseInsensitive(req.params.projectName)}, project);

  res.json(newFile);
});

/*
 * Rename a file in a project.
 */
router.post("/users/:username/projects/:projectName/files/rename", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowercase();
  if (!req.body.filename || !req.body.newFilename) res.status(400).json({response: "Please specify a filename."});
  const newFilename = getFilenameWithExtension(req.body.newFilename, req.body.type);

  const project = await projects.findOne({username: username, name: caseInsensitive(req.params.projectName)});
  if (!project) return res.status(400).json({response: `Project ${req.params.projectName} does not exist.`});

  const existingFile = project.files.filter(file => file.filename === req.body.filename)[0];
  if (!existingFile) return res.status(400).json({response: `File ${filename} does not exist.`});

  const newFile = project.files.filter(file => file.filename === req.body.newFilename)[0];
  if (newFile) return res.status(400).json({response: `File "${filename}" already exists.`});

  existingFile.name = newFilename;
  await projects.update({username: username, name: caseInsensitive(req.params.projectName)}, project);

  res.json({response: "Success"});
});

/*
 * Delete a file from a project.
 */
router.post("/users/:username/projects/:projectName/files/delete", async function(req, res) {
  if (!authorized(req)) return res.status(401).json({response: "Please log in."});
  const username = req.params.username.toLowerCase();
  if (!req.body.filename) res.status(400).json({response: "Please specify a filename."});

  const project = await projects.findOne({username: username, name: caseInsensitive(req.params.projectName)});
  if (!project) return res.status(400).json({response: `Project "${req.params.projectName}" does not exist.`});

  const existingFile = project.files.filter(file => file.filename === req.body.filename)[0];
  if (!existingFile) return res.status(400).json({response: `File "${req.body.filename}" does not exist.`});

  project.files.splice(project.files.indexOf(existingFile), 1);
  await projects.update({username: username, name: caseInsensitive(req.params.projectName)}, project);

  res.json({response: "Success"});
});

/* * * * * * * * *
 * Project View  *
 * * * * * * * * */
router.get("/view/:userId/:projectName/:filename?/", async function(req, res) {
  const user = await users.findOne({_id: new ObjectID(req.params.userId)});
  if (!user) return res.status(400).json({response: `User does not exist.`});

  const project = await projects.findOne({username: user.username, name: caseInsensitive(req.params.projectName)});
  if (!project) return res.status(400).json({response: `Project "${req.params.projectName}" does not exist.`});

  const filename = req.params.filename || "index.html";
  const file = project.files.filter((file) => file.filename === filename)[0];
  if (!file) {
    let response = `<h4 style="text-align: center">404 "${filename}" Not Found</h4>`;
    if (filename === "index.html") {
      response = "<h4 style='text-align: center'>Project does not contain an index.html file</h4>";
    }
    return res.status(404).send(response);
  }

  const type = mime.lookup(filename);
  res.setHeader("Content-Type", type);
  res.send(file.contents);
});

