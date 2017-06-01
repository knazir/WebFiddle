const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));

let db = null;
async function main() {
  const DATABASE_NAME = 'cs193x-db';
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

app.use(jsonParser);

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
        type: "file",
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
        type: "file",
        filename: "index.html",
        contents: ""
      },
      {
        id: `2_2`,
        type: "file",
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
        type: "file",
        filename: "index.html",
        contents: ""
      },
      {
        id: `3_2`,
        type: "file",
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
        type: "file",
        filename: "index.html",
        contents: ""
      },
      {
        id: `4_2`,
        type: "file",
        filename: "app.js",
        contents: ""
      },
      {
        id: `4_3`,
        type: "file",
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
        type: "file",
        filename: "index.html",
        contents: ""
      },
      {
        id: `5_2`,
        type: "file",
        filename: "app.js",
        contents: ""
      },
      {
        id: `5_3`,
        type: "file",
        filename: "main.css",
        contents: ""
      },
      {
        id: `5_4`,
        type: "file",
        filename: "a.js",
        contents: ""
      },
      {
        id: `5_5`,
        type: "file",
        filename: "b.js",
        contents: ""
      },
      {
        id: `5_6`,
        type: "file",
        filename: "c.js",
        contents: ""
      },
      {
        id: `5_7`,
        type: "file",
        filename: "d.js",
        contents: ""
      },
      {
        id: `5_8`,
        type: "file",
        filename: "reallylongfilenameofdoomandstuff.js",
        contents: ""
      },
      {
        id: `5_8`,
        type: "file",
        filename: "maple.html",
        contents: ""
      },
      {
        id: `5_8`,
        type: "file",
        filename: "tomatosauce.css",
        contents: ""
      },
      {
        id: `5_8`,
        type: "file",
        filename: "duck.js",
        contents: ""
      },
      {
        id: `5_8`,
        type: "file",
        filename: "ace.js",
        contents: ""
      }
    ]
  }
];

/*
 * Get a user object. This user has a brief summary of all their projects
 * without the actual file contents.
 * TODO: Make passwords more secure...
 */
router.get("/users/:username/:password", function(req, res) {
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
router.get("/users/:username/projects/:projectId", function(req, res) {
  const project = PROJECTS.filter((project) => project.id === Number.parseInt(req.params.projectId))[0];
  if (!project) res.status(404).send("Not found.");
  else res.json(project);
});

/*
 * Get a single file from a specific project.
 */
router.get("/users/:username/project/:projectId/files/:fileId", function(req, res) {

});

/*
 * Update the contents of a file for a specific project.
 */
router.post("/users/:username/projects/:projectId/files/:fileId/update", function(req, res) {
  const project = PROJECTS.filter((project) => project.id === Number.parseInt(req.params.projectId))[0];
  if (!project) return res.status(404).json({response: `Not found: ${req.params.projectId}`});

  const file = project.files.filter((file) => file.id === req.params.fileId)[0];
  if (!file) return res.status(404).json({response: `Not found: ${req.params.fileId}`});

  file.contents = req.body.contents;
  res.json({response: "Success"});
});


/* * * * * * * * *
 * Project Views *
 * * * * * * * * */
function getProjectFile(req, res, preview) {
  const project = PROJECTS.filter((project) => project.id === Number.parseInt(req.params.projectId))[0];
  if (!project.published && !preview) return res.status(404).send("Not found.");

  const filename = req.params.filename || "index.html";
  const file = project.files.filter((file) => file.filename === filename)[0];
  if (!file) return res.status(404).json({response: `Not found: ${filename}`});

  res.send(file.contents);
}

router.get("/view/:username/:projectId/:filename?", function(req, res) {
  getProjectFile(req, res, false);
});

router.get("/preview/:username/:projectId", function(req, res) {
  getProjectFile(req, res, true);
});


app.use(router);


