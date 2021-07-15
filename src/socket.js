module.exports = (http) => {
    const io = require('socket.io')(http, { cors: { origin: '*', } });

    io.on('connection', socket => {
        console.log('conectado a socket')

        socket.on('subscribe', function(data) { socket.join(data.room); })
        socket.on('unsubscribe', function(data) { socket.leave(data.room); })

        socket.on('room', function({ keywords }){
            socket.leaveAll();
            for (const e of keywords) {
                socket.join(e);
            }
        });

        socket.on('disconnecting', () => {
            console.log('disconnecting');
        });
        socket.on('disconnect', () => {
            console.log('disconnect');
        });
    })

    return io
}