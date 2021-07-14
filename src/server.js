const express = require('express')
const app = express()
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const MongoClient = require('mongodb').MongoClient
const connectionString = process.env.NODE_DB;

app.use(cors());

app.use(express.json())

const server = app.listen(3000, function() {
    console.log('listening on 3000')
})

// const socket = require('./socket')
// socket(server);

const io = require('socket.io')(server, { cors: { origin: '*', } });

io.on('connection', (socket) => {
    console.log('conectado a socket')

    socket.on('chat-message', (msg) => {
        io.emit('chat-message', msg);
    });

    socket.on('addKeyword', (data) => {
        console.log('addKeyword',data)
        io.emit('CHAT_MESSAGE', data);
    });
    

    socket.on('pingServer', (msg) => {
        console.log('pingServer')
        console.log('mensaje',msg)
        io.emit('customEmit', 'prueba');
    });
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/new_event', (req, res) => {
    res.sendFile(__dirname + '/views/events.html')
})
app.get('/new_keyword', (req, res) => {
    res.sendFile(__dirname + '/views/keywords.html')
})

app.post('/events-list', async (req, res) => {

    const { keywords } = req.body

    try {
        const client = await MongoClient.connect(connectionString);
        const db = client.db('map-events')

        const filter = (keywords?.length>0) ? {
            keywords: {
                "$not": {
                    "$elemMatch": {
                        "$nin": keywords
                    }
                }
            }
        } : {}

        const events = await db.collection('events').find(filter).toArray()
        res.send({ list: events, keywords })

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
        res.send({ errors: ['error no controlado'] })
    }

})