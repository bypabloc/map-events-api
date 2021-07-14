const express = require('express')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

const MongoClient = require('mongodb').MongoClient
const connectionString = process.env.NODE_DB;
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json())

const server = app.listen(PORT, function() {
    console.log('listening on ',PORT)
})

const socket = require('./socket')
const io = socket(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/events-list', async (req, res) => {

    const { keywords } = req.body

    try {
        const client = await MongoClient.connect(connectionString);
        const table = client.db('map-events')

        const filter = (keywords?.length>0) ? {
            keywords: {
                "$not": {
                    "$elemMatch": {
                        "$nin": keywords
                    }
                }
            }
        } : {}

        const events = await table.collection('events').find(filter).toArray()

        io.emit('keywords', { keywords });
        io.emit('LIST',{ list: events, keywords });

        res.send({ list: events, keywords })

    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: ['error no controlado'] })
    }
})
app.post('/events', async (req, res) => {

    const { description, keywords, coordenadas } = req.body

    try {
        
        const client = await MongoClient.connect(connectionString);
        const table = client.db('map-events')

        const eventsCollection = table.collection('events')

        const event = await eventsCollection.insertOne({ description, keywords, coordenadas })

        io.emit('EVENT_ADD',{ 
            id: event.insertedId,
            description,
            keywords,
            coordenadas,
        });

        res.send({
            id: event.insertedId,
            description,
            keywords,
            coordenadas,
        })

    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: ['error no controlado'] })
    }

})


app.get('/keywords', async (req, res) => {
    try {
        
        const client = await MongoClient.connect(connectionString);
        const table = client.db('map-events')

        const keywords = await table.collection('keywords').find().toArray()
        
        res.send({ list: keywords })

    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: ['error no controlado'] })
    }
})
app.post('/keywords', async (req, res) => {
    const { text } = req.body

    try {
        
        const client = await MongoClient.connect(connectionString);
        const table = client.db('map-events')

        const keywordsCollection = table.collection('keywords')

        const keyword = await keywordsCollection.insertOne({ text })

        io.emit('KEYWORD_ADD',{ 
            id: keyword.insertedId,
            text,
        });

        res.send({ 
            id: keyword.insertedId,
            text,
         })
    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: ['error no controlado'] })
    }

})