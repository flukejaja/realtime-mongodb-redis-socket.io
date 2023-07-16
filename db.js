const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017";
const Client = new MongoClient(url);
Client.connect();
const db = Client.db("local");
const dbTest = db.collection("dbTest");
module.exports = { dbTest }