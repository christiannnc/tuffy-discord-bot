const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const keepAlive = () => {
  server.listen(3000, () => {
    console.log('Server is online!');
  });
};

keepAlive();
