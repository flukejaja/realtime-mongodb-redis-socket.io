const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();

const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 19624
    },
    legacyMode: true
});

redisClient.connect();

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', err => console.log('Redis Client Error', err));

const getAsync = promisify(redisClient.get).bind(redisClient);

module.exports = { redisClient, getAsync };