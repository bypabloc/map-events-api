module.exports = async ( table ) => {
    const url = process.env.NODE_DB;

    const { MongoClient } = require('mongodb')
    const client = new MongoClient(url)

    await client.connect()

    const database = 'map-events';
    
    const db = client.db(database)

    return db.collection(table)
}