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

app.get('/events', async (req, res) => {
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
        res.send({ errors: ['error no controlado'] })
    }
})
app.post('/events', async (req, res) => {
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
        res.send({ errors: ['error no controlado'] })
    }

})


app.get('/keywords', async (req, res) => {
    console.log('req',req)

    try {
        
        const client = await MongoClient.connect(connectionString);
        // const MyCollection = db.collection('MyCollection');
        // const result = await MyCollection.find().toArray();

        console.log('client',client)

        const db = client.db('map-events')
        console.log('db',db)

        const keywords = await db.collection('keywords').find().toArray()
        console.log('keywords',keywords)
        
        res.send({ list: keywords })

    } catch (err) {
        console.log('err',err)
        res.send({ errors: ['error no controlado'] })
    }
})
app.post('/keywords', async (req, res) => {

    const { name } = req.body

    try {
        
        const client = await MongoClient.connect(connectionString);
        // const MyCollection = db.collection('MyCollection');
        // const result = await MyCollection.find().toArray();

        const db = client.db('map-events')
        // console.log('result',result)

        const keywordsCollection = db.collection('keywords')

        keywordsCollection.insertOne({ name })
            .then(result => {
            })
            .catch(error => console.error(error))

        res.send({ name })

    } catch (err) {
        console.log('err',err)
        res.send({ errors: ['error no controlado'] })
    }

})