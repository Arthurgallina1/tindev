const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const { uDB, pDB }  = require('./config/config')
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);//tanto websocket qnt http

const connectedUsers = {};

io.on('connection', socket => {
    // console.log('new connection', socket.id);
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
    // console.log(user, socket.id)


});

mongoose.connect(`mongodb+srv://${uDB}:${pDB}@clustermevn-cztsy.mongodb.net/dev?retryWrites=true&w=majority`, 
{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//middleware. req -> middleware pra add 2 variaveis na req
app.use((req,res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

app.use(express.json());
app.use(cors());
app.use(routes);
 

server.listen(8000);

