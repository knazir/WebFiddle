/* * * * * * * * * * * * * * * * * * * * *
 * Creates Database and Loads Demo Data  *
 * * * * * * * * * * * * * * * * * * * * */
async function loadDemoData(users, projects) {
  await users.insertOne({ username: "demo" });
  await projects.insertOne({
    username: "demo",
    name: "Demo Project",
    createDate: new Date(),
    files: []
  });
}

async function main() {
  const MongoClient = require("mongodb").MongoClient;
  const ObjectID = require("mongodb").ObjectID;

  const DATABASE_NAME = "cs193x-db";
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.

  process.stdout.write("Connecting to MongoDB... ");
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
  process.stdout.write("Done.\n");

  process.stdout.write("Dropping database... ");
  db.dropDatabase();
  process.stdout.write("Done.\n");

  process.stdout.write("Creating Users collection... ");
  await db.createCollection("users");
  process.stdout.write("Done.\n");

  process.stdout.write("Creating Projects collection... ");
  await db.createCollection("projects");
  process.stdout.write("Done.\n");

  const users = db.collection("users");
  const projects = db.collection("projects");

  process.stdout.write("Loading demo data... ");
  await loadDemoData(users, projects);
  process.stdout.write("Done.\n");

  process.exit();
}

main();