const express = require('express');
const http = require('http');
const path = require("path");
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');


const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
let users = new users();


app.use(express.static(path.join(__dirname, '../public')));

// listen to connection that comes in
io.on('connection', (socket) =>{
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback('Name and group are required.')
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //socket.leave('The office fans')
        //io.emit -> io.to('The office fans').emit
        //socket.broadcast.emit -> socket.broadcast.to('The office Fans').emit
        //socket.emit

        //socket.emit from Admin text Welcome to the chat app
        socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));

        // socket.broadcast.emit from Admin text new user joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

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

