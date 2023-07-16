const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { redisClient, getAsync } = require('./redis');
const { dbTest } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('A client connected.');
    socket.on('get:data', async () => {
      const data = await getDataFromMongoDB();
      socket.emit('data', data);
    });
  
    socket.on('disconnect', () => {
      console.log('A client disconnected.');
    });
  });
  
  async function getDataFromMongoDB() {
    const data =  dbTest.find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
    redisClient.set('data', JSON.stringify(data));
    return data;
  }

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html');
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});