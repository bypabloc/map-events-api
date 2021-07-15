const express = require('express')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

// importamos la conexion a la db 
const db = require('./db-connection')

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json())

const server = app.listen(PORT, function() {
    console.log('listening on ',PORT)
})

// importamos la configuracion de los sockets
const socket = require('./socket')
const io = socket(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

// endpoint el cual traera la lista de eventos
app.post('/events-list', async (req, res) => {

    // decontruimos para obtener los keywords a filtrar
    const { keywords } = req.body

    try {
        // hacemos conexion con la collection 'events'
        const table = await db('events')

        // buscamos a partir del array de keywords
        const filter = {
            keywords: {
                "$not": {
                    "$elemMatch": {
                        "$nin": keywords
                    }
                }
            }
        }

        // traera los registros que haya hecho match con el filtrado anteriormente formado
        const events = await table.find(filter).toArray()

        res.send({ list: events, keywords })

    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: [err.message] })
    }
})
app.post('/events', async (req, res) => {

    // decontruimos para obtener los datos a registrar
    const { description, keywords, coordenadas } = req.body

    try {
        // hacemos conexion con la collection 'events'
        const table = await db('events')

        // insertamos el registro en la db
        const event = await table.insertOne({ description, keywords, coordenadas })
        
        // validamos si fue indicada alguna keyword
        if(keywords?.length>0){
            // enviamos el evento a la keywords indicada
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
        // hacemos conexion con la collection 'keywords'
        const table = await db('keywords')

        // traemos la lista de todos los keywords
        const keywords = await table.find().toArray()
        
        res.send({ list: keywords })
    } catch (err) {
        console.log('err',err)
        res.status(429).send({ errors: [err.message] })
    }
})
app.post('/keywords', async (req, res) => {
    // decontruimos para obtener los datos a registrar
    const { text } = req.body

    try {
        // hacemos conexion con la collection 'keywords'
        const table = await db('keywords')
        
        // insertamos el registro en la db
        const keyword = table.insertOne({ text })

        // enviamos el evento a todos los users que estan conectado
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