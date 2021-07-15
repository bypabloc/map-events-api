const express = require('express')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

const db = require('./db-connection')

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
        if(keywords?.length>0){
            for (const e of keywords) {
                io.to(e).emit('keywords', { keywords });
            }
        }

        const table = await db('events')

        const filter = {
            keywords: {
                "$not": {
                    "$elemMatch": {
                        "$nin": keywords
                    }
                }
            }
        }

        const events = await table.find(filter).toArray()

        // io.emit('LIST',{ list: events, keywords });

        res.send({ list: events, keywords })

    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: [err.message] })
    }
})
app.post('/events', async (req, res) => {

    const { description, keywords, coordenadas } = req.body

    try {
        const table = await db('events')

        const event = await table.insertOne({ description, keywords, coordenadas })
        
        if(keywords?.length>0){
            io.to(keywords).emit('EVENT_ADD',{ 
                id: event.insertedId,
                description,
                keywords,
                coordenadas,
            })
        }
        
        res.send({
            id: event.insertedId,
            description,
            keywords,
            coordenadas,
        })

    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: [err.message] })
    }

})


app.get('/keywords', async (req, res) => {
    try {
        const table = await db('keywords')

        const keywords = await table.find().toArray()
        
        res.send({ list: keywords })
    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: [err.message] })
    }
})
app.post('/keywords', async (req, res) => {
    const { text } = req.body

    try {
        const table = await db('keywords')
        
        const keyword = table.insertOne({ text })

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
        res.status(429).send({ errors: [err.message] })
    }

})