

module.exports = (http) => {
    const io = require('socket.io')(http, { cors: { origin: '*', } });

    io.on('connection', (socket) => {
        console.log('conectado a socket')
        socket.on('chat-message', (msg) => {
            io.emit('chat-message', msg);
        });

        socket.on('addKeyword', (data) => {
            console.log('addKeyword',data)
            io.emit('addKeywordItem', data);
        });

        socket.on('pingServer', (msg) => {
            console.log('pingServer')
            console.log('mensaje',msg)
            io.emit('customEmit', 'prueba');
        });
    })
}