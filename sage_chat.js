var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var pg   = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://temba:temba@decrep.it:5432/temba';
const dbClient = new pg.Client(connectionString);
dbClient.connect();
getStateDiagram(dbClient);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('chat message', function(msg) {
        var now = getCurrentTimestamp();
        console.log(now + ": " + msg);
        io.emit('chat message', now + ": " + msg);
    });
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


//--------- UTILS ---------//
function getStateDiagram(dbClient) {
    dbClient.query("SELECT * FROM flows_ruleset", function(err, result) {
        // console.log(result.rows.length);
    });

}

function getCurrentTimestamp() {
    var now = new Date();
    // return now.toLocaleDateString("en-US") + " " + now.toLocaleTimeString("en-US");
    return now.toLocaleTimeString("en-US");
}

