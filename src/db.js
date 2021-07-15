module.exports = async () => {
    const MongoClient = require('mongodb').MongoClient
    const connectionString = process.env.NODE_DB;

    const db = MongoClient.connect(connectionString);

    return await db
}