import http from 'http';
import { GET } from '../src/methods/GET.ts';

const server = http.createServer();
server.on('request', (req, res) => {
  const url = req.url?.split('/').slice(0, 3).join('/')
  res.setHeader('Content-Type', 'application/json');

  if ( url === "/api/users"){
    if (req.method === "GET") {
      const response = GET(req.url);
      if (response?.status) {
      res.statusCode = response.status;
      res.write(JSON.stringify(response.user));
      res.end();
      }
    }
  } else {
    res.statusCode = 404;
    res.write('Invalid URL');
    res.end();
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

const PORT = process.env.PORT || 3999;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});