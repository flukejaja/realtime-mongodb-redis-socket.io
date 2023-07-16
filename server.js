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
  
    socket.on('get:data', async () => {
      const data = await getDataFromMongoDB();
      socket.emit('data', data);
    });
  
    socket.on('disconnect', () => {
      console.log('A client disconnected.');
    });
  });
  
  const getDataFromMongoDB = async () => {

    const cached = await getAsync('data:redis');

    if(cached){
      return JSON.parse(cached);
    }

    const data = await dbTest.find({}).toArray();
    redisClient.setEx('data:redis', 60 ,JSON.stringify(data));
 
    return data;
  }

  app.get('/', (_, res) => {
    res.sendFile(__dirname + '/view/index.html');
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});