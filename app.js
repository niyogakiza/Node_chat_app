const express = require('express');
const http = require('http');
const path = require("path");
const socketIO = require('socket.io');

const index = require('./routes/index');
const users = require('./routes/users');


const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(express.static(path.join(__dirname, 'public')));

// listen to connection that comes in
io.on('connection', (socket) =>{
    console.log('New user connected');


    socket.on('createMessage', (message) =>{
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    });

    socket.on('disconnected', () =>{
        console.log('User was disconnected');
    });
});



app.use('/', index);
app.use('/users', users);

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


module.exports = app;
