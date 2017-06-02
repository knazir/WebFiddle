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
    published: false,
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
    published: false,
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
    published: false,
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
    published: false,
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
    published: false,
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

// TODO: Change POST requests to PATCH where appropriate

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
 * Set a project's published status.
 */
router.post("/users/:username/projects/:projectName/publish", function(req, res) {
  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});
  project.published = req.body.published;
  res.json({response: "Success"});
});


/* * * * * * * * *
 * Project Views *
 * * * * * * * * */
function getProjectFile(req, res, preview) {
  const project = PROJECTS.filter((project) => project.name === req.params.projectName)[0];
  if (!project) return res.status(400).json({response: `Not found: Project ${req.params.projectName}`});
  if (!project.published && !preview) return res.status(400).json({response: `Not found: Project not published.`});

  const filename = req.params.filename || "index.html";
  const file = project.files.filter((file) => file.filename === filename)[0];
  if (!file) return res.status(400).json({response: `Not found: File ${filename}`});

  const type = mime.lookup(filename);
  res.setHeader("Content-Type", type);
  res.send(file.contents);
}

router.get("/view/:username/:projectName/:filename?/", function(req, res) {
  getProjectFile(req, res, false);
});

router.get("/preview/:username/:projectName/:filename?/", function(req, res) {
  getProjectFile(req, res, true);
});

