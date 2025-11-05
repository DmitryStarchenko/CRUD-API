import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from vanilla Node.js!' }));
});

const PORT = process.env.PORT || 3999;
server.listen(PORT, () => {
  console.log(`Server running!!!`);
});