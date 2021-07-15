// config de la conexion con la base de datos

module.exports = async ( table ) => {
    const url = process.env.NODE_DB;

    // importamos la base de datos
    const { MongoClient } = require('mongodb')

    // instanciamos MongoClient
    const client = new MongoClient(url)

    // creamos la conexion
    await client.connect()

    const database = 'map-events';
    
    // conectamos con la base de datos
    const db = client.db(database)

    // conectamos con la tabla en especifico
    return db.collection(table)

    // NOTA: esta funcion devolvera una promesa
}