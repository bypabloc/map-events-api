const express = require('express')
const app = express()
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const MongoClient = require('mongodb').MongoClient
const connectionString = process.env.NODE_DB;

app.use(cors());

app.use(express.json())

app.listen(3000, function() {
    console.log('listening on 3000')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/new_event', (req, res) => {
    res.sendFile(__dirname + '/events.html')
})
app.get('/new_keyword', (req, res) => {
    res.sendFile(__dirname + '/keywords.html')
})

app.post('/events-list', async (req, res) => {
    try {
        const client = await MongoClient.connect(connectionString);
        const db = client.db('map-events')

        const events = await db.collection('events').find().toArray()
        console.log('events',events)
        
        res.send({ list: events })

    } catch (err) {
        console.log('err',err)
        res.send({ errors: ['error no controlado'] })
    }
})
app.post('/events', async (req, res) => {

    const { description, keywords, coordenadas } = req.body

    try {
        
        const client = await MongoClient.connect(connectionString);
        const db = client.db('map-events')

        const eventsCollection = db.collection('events')

        const event = await eventsCollection.insertOne({ description, keywords, coordenadas })

        res.send({
            id: event.insertedId,
            description,
            keywords,
            coordenadas,
        })

    } catch (err) {
        console.log('err',err)
        res.send({ errors: ['error no controlado'] })
    }

})


app.get('/keywords', async (req, res) => {
    try {
        
        const client = await MongoClient.connect(connectionString);
        const db = client.db('map-events')

        const keywords = await db.collection('keywords').find().toArray()
        
        res.send({ list: keywords })

    } catch (err) {
        console.log('err',err)
        res.send({ errors: ['error no controlado'] })
    }
})
app.post('/keywords', async (req, res) => {
    const { text } = req.body

    try {
        
        const client = await MongoClient.connect(connectionString);
        const db = client.db('map-events')

        const keywordsCollection = db.collection('keywords')

        const keyword = await keywordsCollection.insertOne({ text })

        res.send({ 
            id: keyword.insertedId,
            text,
         })
    } catch (err) {
        console.log('err',err)
        res.send({ errors: ['error no controlado'] })
    }

})