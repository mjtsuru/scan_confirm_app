var express = require('express');
var app = express();
var http = require('http').Server(app);
// for interactive messaging
const io = require('socket.io')(http);
const PORT = process.env.PORT || 80;

var sharp = require('sharp');

// sharp('data/test.bmp')
//   .resize(720, 1115,{
//     position: 'south'
//   })
//   .rotate(90)
//   .toFile('data/output4.jpg', function(err) {
//       if (err) console.log(err);
//   });

app.use(express.static('.'));

app.get('/' , function(req, res){
    console.log('get req');
    res.sendFile(__dirname+'/index.html');
});

//Start Server
http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
