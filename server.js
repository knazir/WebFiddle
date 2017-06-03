const bodyParser = require("body-parser");
const express = require("express");
const slash = require("express-slash"); // Middleware to enforce trailing slashes, important for serving projects
const mime = require("mime"); // For determining MIME type of project files
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const app = express();
const jsonParser = bodyParser.json();

app.enable("strict routing");
app.use(express.static("public"));
app.use(jsonParser);
app.use(cors({ origin: /https?:\/\/(.*\.cs193xfiddle\.herokuapp\.com|localhost)(:[0-9]+)?/i, credentials: true }));

const router = express.Router({
  strict: app.get("strict routing")
});

app.use(router);
app.use(slash());

let db = null;
async function main() {
  const DATABASE_NAME = "cs193x-db";
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);

  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
}

main();

////////////////////////////////////////////////////////////////////////////////

const PROJECTS = [
  {
    id: 1,
    name: "Simple Project",
    createDate: new Date(),
    lastModified: new Date(),
    files: [
      {
        id: `1_1`,
        type: "html",
        filename: "index.html",
        contents: ""
      }
    ]
  },
  {
    id: 2,
    name: "Hello World",
    createDate: new Date(),
    lastModified: new Date(),
    files: [
      {
        id: `2_1`,
        type: "html",
        filename: "index.html",
        contents: ""
      },
      {
        id: `2_2`,
        type: "js",
        filename: "app.js",
        contents: ""
      }
    ]
  },
  {
    id: 3,
    name: "HW1",
    createDate: new Date(),
    lastModified: new Date(),
    files: [
      {
        id: `3_1`,
        type: "html",
        filename: "index.html",
        contents: ""
      },
      {
        id: `3_2`,
        type: "css",
        filename: "main.css",
        contents: ""
      }
    ]
  },
  {
    id: 4,
    name: "HW2",
    createDate: new Date(),
    lastModified: new Date(),
    files: [
      {
        id: `4_1`,
        type: "html",
        filename: "index.html",
        contents: ""
      },
      {
        id: `4_2`,
        type: "js",
        filename: "app.js",
        contents: ""
      },
      {
        id: `4_3`,
        type: "css",
        filename: "main.css",
        contents: ""
      }
    ]
  },
  {
    id: 5,
    name: "HW3",
    createDate: new Date(),
    lastModified: new Date(),
    files: [
      {
        id: `5_1`,
        type: "html",
        filename: "index.html",
        contents: ""
      },
      {
        id: `5_2`,
        type: "js",
        filename: "app.js",
        contents: ""
      },
      {
        id: `5_3`,
        type: "css",
        filename: "main.css",
        contents: ""
      },
      {
        id: `5_4`,
        type: "js",
        filename: "a.js",
        contents: ""
      },
      {
        id: `5_5`,
        type: "js",
        filename: "b.js",
        contents: ""
      },
      {
        id: `5_6`,
        type: "js",
        filename: "c.js",
        contents: ""
      },
      {
        id: `5_7`,
        type: "js",
        filename: "d.js",
        contents: ""
      },
      {
        id: `5_8`,
        type: "js",
        filename: "reallylongfilenameofdoomandstuff.js",
        contents: ""
      },
      {
        id: `5_9`,
        type: "html",
        filename: "maple.html",
        contents: ""
      },
      {
        id: `5_10`,
        type: "css",
        filename: "tomatosauce.css",
        contents: ""
      },
      {
        id: `5_11`,
        type: "js",
        filename: "duck.js",
        contents: ""
      },
      {
        id: `5_12`,
        type: "js",
        filename: "ace.js",
        contents: ""
      }
    ]
  }
];

/* * * * * * * * * * *
 * Helper Functions  *
 * * * * * * * * * * */
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

function createIndexFile(id) {
  return {
    id: id,
    type: "html",
    filename: "index.html",
    contents: ""
  };
}

function createCSSFile(id) {
  return {
    id: id,
    type: "css",
    filename: "main.css",
    contents: ""
  }
}

function createJSFile(id) {
  return {
    id: id,
    type: "js",
    filename: "app.js",
    contents: ""
  }
}


/* * * * * * * *
 * API Routes  *
 * * * * * * * */

/*
 * Get a user object. This user has a brief summary of all their projects
 * without the actual file contents.
 */
router.get("/users/:username", function(req, res) {
  const projects = PROJECTS.map((project) => {
    const result = {};
    for (const key of Object.keys(project)) {
      if (key !== "files") result[key] = project[key];
    }
    return result;
  });

  const user = {
    username: req.params.username,
    projects: projects
  };

  res.json(user);
});

/*
 * Get project info including file contents.
 */
router.get("/users/:username/projects/:projectName", function(req, res) {
  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});
  res.json(project);
});

/*
 * Get a single file from a project by its ID.
 */
router.get("/users/:username/projects/:projectName/files/:fileId", function(req, res) {
  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});

  let file = project.files.filter((file) => file.id === req.params.fileId)[0];
  if (!file) return res.status(400).json({response: `Not found: File ${req.params.fileId}`});

  res.json(file);
});

/*
 * Create a new project.
 */
router.post("/users/:username/projects/create", function(req, res) {
  if (!req.body.projectName) return res.status(400).json({response: "Please specify a project name."});
  const existingProject = PROJECTS.filter((project) => project.name === req.body.projectName)[0];
  if (existingProject) return res.status(400).json({response: `Project ${req.body.projectName} already exists.`});

  const projectId = (Math.floor(Math.random() * 1000000) + 1).toString();

  let files = [createIndexFile(`${projectId}_1`)];
  if (req.body.useStarterCode) {
    files.push(createCSSFile(`${projectId}_2`));
    files.push(createJSFile(`${projectId}_3`));
  }

  const newProject = {
    id: projectId,
    name: req.body.projectName,
    createDate: new Date(),
    lastModified: new Date(),
    files: files
  };

  PROJECTS.push(newProject);
  res.json(newProject);
});

/*
 * Rename a project.
 */
router.post("/users/:username/projects/rename", function(req, res) {
  const project = PROJECTS.filter((project) => project.name === req.body.projectName)[0];
  if (!req.body.projectName) res.status(400).json({response: "Please specify a project name."});
  if (!project) return res.status(400).json({response: `Project ${req.body.projectName} does not exist.`});

  const newProject = PROJECTS.fitler((project) => project.name === req.body.newProjectName)[0];
  if (newProject) return res.status(400).json({response: `Project ${req.body.newProjectName} already exists.`});

  project.name = req.body.newProjectName;
  res.json({response: "Success"});
});

/*
 * Delete a project.
 */
router.post("/users/:username/projects/delete", function(req, res) {
  if (!req.body.projectName) return res.status(400).json({response: "Must specify project name."});
  const project = PROJECTS.filter((project) => project.name === req.body.projectName)[0];
  if (!project) return res.status(400).json({response: `Project ${req.body.projectName} does not exist.`});

  PROJECTS.splice(PROJECTS.indexOf(project), 1);
  res.json({response: "Success"});
});

/*
 * Update the contents of a file for a project.
 */
router.post("/users/:username/projects/:projectName/files/:fileId/update", function(req, res) {
  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});

  const file = project.files.filter((file) => file.id === req.params.fileId)[0];
  if (!file) return res.status(400).json({response: `Not found: File ${req.params.fileId}`});

  file.contents = req.body.contents;
  res.json({response: "Success"});
});

/*
 * Create a file in a project.
 */
router.post("/users/:username/projects/:projectName/files/create", function(req, res) {
  const filename = getFilenameWithExtension(req.body.filename, req.body.type);

  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});

  if (!req.body.filename) res.status(400).json({response: "Please specify a filename."});

  const existingFile = project.files.filter((file) => file.filename === filename)[0];
  if (existingFile) return res.status(400).json({response: `File ${filename} already exists.`});

  if (!req.body.type) return res.status(400).json({response: "Please specify a file type."});

  const newFile = {
    id: `${project.id}_${project.files.length + 1}`,
    type: req.body.type,
    filename: filename,
    contents: ""
  };

  project.files.push(newFile);
  res.json(newFile);
});

/*
 * Rename a file in a project.
 */
router.post("/users/:username/projects/:projectName/files/rename", function(req, res) {
  const newFilename = getFilenameWithExtension(req.body.newFilename, req.body.type);

  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});

  if (!req.body.filename || !req.body.newFilename) res.status(400).json({response: "Please specify a filename."});

  const existingFile = project.files.filter((file) => file.filename === req.body.filename)[0];
  if (!existingFile) return res.status(400).json({response: `File ${filename} does not exist.`});

  const newFile = project.files.filter((file) => file.filename === req.body.newFilename)[0];
  if (newFile) return res.status(400).json({response: `File ${filename} already exists.`});

  existingFile.name = newFilename;
  res.json({response: "Success"});
});

/*
 * Delete a file from a project.
 */
router.post("/users/:username/projects/:projectName/files/delete", function(req, res) {
  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});

  if (!req.body.filename) res.status(400).json({response: "Please specify a filename."});

  const existingFile = project.files.filter((file) => file.filename === req.body.filename)[0];
  if (!existingFile) return res.status(400).json({response: `File ${req.body.filename} does not exist.`});

  project.files.splice(project.files.indexOf(existingFile), 1);
  res.json({response: "Success"});
});

/* * * * * * * * *
 * Project Views *
 * * * * * * * * */
router.get("/view/:username/:projectName/:filename?/", function(req, res) {
  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});

  const filename = req.params.filename || "index.html";
  const file = project.files.filter((file) => file.filename === filename)[0];
  if (!file) return res.status(400).json({response: `Not found: File ${filename}`});

  const type = mime.lookup(filename);
  res.setHeader("Content-Type", type);
  res.send(file.contents);
});

