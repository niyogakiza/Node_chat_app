//const moment = require('moment');

const socket = io();

function scrollToBottom (){

    //Selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();


    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }

}


socket.on('connect', function() {
    console.log('Connected to server');

});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');

    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });


    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    let formattedTime = moment(message.createdAt).format('h:mm a');

    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {

        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

     $('#messages').append(html);
     scrollToBottom();
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
    //
    // locationButton.disabled = true;
    // locationButton.innerHTML = 'Sending Location';

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        // locationButton.disabled = false;
        // locationButton.innerHTML = 'Send Location';
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        // locationButton.disabled = false;
        // locationButton.innerHTML = 'Send Location';
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    });
});

