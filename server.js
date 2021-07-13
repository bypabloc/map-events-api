const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient
const connectionString = process.env.NODE_DB;

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, function() {
    console.log('listening on 3000')
})

// All your handlers here...
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/map-events', async (req, res) => {
    console.log('req',req)

    try {
        
        const client = await MongoClient.connect(connectionString);
        // const MyCollection = db.collection('MyCollection');
        // const result = await MyCollection.find().toArray();

        console.log('client',client)

        const db = client.db('map-events')
        console.log('db',db)

        const events = await db.collection('events').find().toArray()
        console.log('events',events)
        
        res.send({ list: events })

    } catch (err) {
        console.log('err',err)
        res.send({ errors: [''] })
    }

})
app.post('/map-events', async (req, res) => {
    console.log('req',req)

    const { body } = req

    try {
        
        const client = await MongoClient.connect(connectionString);
        // const MyCollection = db.collection('MyCollection');
        // const result = await MyCollection.find().toArray();

        console.log('client',client)

        const db = client.db('map-events')
        console.log('db',db)
        // console.log('result',result)

        const eventsCollection = db.collection('events')

        eventsCollection.insertOne(body)
            .then(result => {
                console.log(result)
            })
            .catch(error => console.error(error))

        res.send({ body })

    } catch (err) {
        console.log('err',err)
        res.send({ errors: [''] })
    }

})

// MongoClient.connect(connectionString, {
//     useUnifiedTopology: true
// }, (err, client) => {
//     if (err) return console.error(err)
//     console.log('Connected to Database')
// })