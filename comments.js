//Create web server
var express = require('express');
var app = express();
//Create server
var server = require('http').Server(app);
//Create socket.io
var io = require('socket.io')(server);
//Create the connection to the database
var mysql = require('mysql');
//Create the connection to the database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'comments'
});
//Connection to the database
connection.connect(function(error){
    if(error){
        console.log('Error');
    }else{
        console.log('Connected to the database');
    }
});
//Create the route
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
//Create the route to get the data
app.get('/get-comments', function(req, res){
    connection.query('SELECT * FROM comments', function(error, rows, fields){
        if(error){
            console.log('Error in the query');
        }else{
            res.send(rows);
        }
    });
});
//Create the route to add a comment
app.get('/add-comment', function(req, res){
    var comment = req.query.comment;
    connection.query('INSERT INTO comments (comment) VALUES ("'+comment+'")', function(error, rows, fields){
        if(error){
            console.log('Error in the query');
        }else{
            res.send('Comment added');
        }
    });
});
//Create the socket
io.on('connection', function(socket){
    console.log('Someone is connected');
    socket.on('new-comment', function(data){
        io.sockets.emit('new-comment', data);
    });
});
//Server listening
server.listen(3000, function(){
    console.log('Server running on port 3000');
});