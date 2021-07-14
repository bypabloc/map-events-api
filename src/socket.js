module.exports = (http) => {
    const io = require('socket.io')(http, { cors: { origin: '*', } });

    io.on('connection', (socket) => {
        console.log('conectado a socket')
    })

    return io
}