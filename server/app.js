const express = require('express');
const http = require('http');
const path = require("path");
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static(path.join(__dirname, '../public')));

// listen to connection that comes in
io.on('connection', (socket) =>{
    console.log('New user connected');

    //socket.emit from Admin text Welcome to the chat app
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));

    // socket.broadcast.emit from Admin text new user joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('join', (params, callback) => {
        if(isRealString(params.name) || !isRealString(params.room)){
            callback('Name and group are required.')
        }

        callback();
    });


    socket.on('createMessage', (message, callback) =>{
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();

    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    });

    socket.on('disconnected', () =>{
        console.log('User was disconnected');
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

 // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, () =>{
    console.log(`Server is up on port ${port}`);
});

