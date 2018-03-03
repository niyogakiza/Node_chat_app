const socket = io();
socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createMessage',{
        from: 'Aimable',
        text: 'Hey, am learning hard!!'
    });
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
});