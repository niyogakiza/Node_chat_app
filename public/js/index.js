const socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);

    let li = $('<li></li>');
    li.text(`${message.from}:  ${message.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    let li = $('<li></li>');
    let a = $('<a target="_blank">My Current Location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li)
});


$('#message-form').on('submit', function (e) {
    e.preventDefault();

    let messageTextbox = $('[name=message]');

    socket.emit('createMessage',{
        from:'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('')

    });
});

const locationButton = $('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.disabled = true;
    locationButton.innerHTML = 'Sending Location';


    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.disabled = false;
        locationButton.innerHTML = 'Send Location';
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.disabled = false;
        locationButton.innerHTML = 'Send Location';
        alert('Unable to fetch location.');
    })
});

