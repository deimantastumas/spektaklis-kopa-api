const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

let dunes = {};

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get('/delete-dunes', (_, res) => {
  dunes = {};
  socket.to("summary").emit('all_dunes', {'dunes': dunes});
  res.send('OK');
});

io.on('connection', function(socket){
  socket.on('join_room', (data) => {
    console.log(`Someone joined the room ${data.room}`)
    socket.join(data.room);
  })
  socket.on('get_dunes', function(data) {
    socket.emit('all_dunes', {'dunes': dunes});
  });
  socket.on('write_dunes', function(data) {
    dunes[data.clientId] = data.dunes;
    socket.to("summary").emit('all_dunes', {'dunes': dunes});
  })
 });

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
