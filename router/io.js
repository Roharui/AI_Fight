
module.exports = function(io){
    io.on('connection', (socket) => {
        socket.on('stage', (msg) => {
            io.emit('stage', msg);
        });
        socket.on('disconnect', () => {
        console.log('user disconnected');
        });
    });
}