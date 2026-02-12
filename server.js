// const http = require('http');

// http.createServer(function (req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World!');
// }).listen(8080, () => {
//     console.log('Server running at http://localhost:8080/');
// });
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
}).listen(8080, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:8080/');
});

const express = require('express');
const app = express();

app.use(express.json());

app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));