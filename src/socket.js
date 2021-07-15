// config de los sockets

module.exports = (http) => {

    // importamos socket.io -> los sig parametros son para permitir desde cualquier origen el consumo de este servicio
    const io = require('socket.io')(http, { cors: { origin: '*', } });

    io.on('connection', socket => {
        console.log('conectado a socket')

        // creamos funcion independiente para unirse a una sala en especifico
        socket.on('subscribe', function(data) { socket.join(data.room); })

        // creamos funcion independiente para salirse de una sala en especifico
        socket.on('unsubscribe', function(data) { socket.leave(data.room); })

        // funcion para registrarse en una lista de salas (espera un arreglo de string)
        socket.on('room', function({ keywords }){
            socket.leaveAll();
            for (const e of keywords) {
                socket.join(e);
            }
        });

        // funcion para detectar cuando un user se esta desconectando
        socket.on('disconnecting', () => {
            console.log('disconnecting');
        });

        // funcion para detectar cuando un user se ha desconectado
        socket.on('disconnect', () => {
            console.log('disconnect');
        });
    })

    return io
}