import http from 'http';
import { GET } from './methods/GET.ts';
import { POST } from './methods/POST.ts';
import { serverHandler } from './utils/serverHandler.ts';

const server = http.createServer();
server.on('request', async (req, res) => {
  const url = req.url?.split('/').slice(0, 3).join('/');
  res.setHeader('Content-Type', 'application/json');

  if (url === '/api/users') {
    switch (req.method) {
      case 'GET': {
        const getUser = GET(req.url);
        serverHandler(res, getUser);
        break;
      }
      case 'POST': {
        const newUser = await POST(req);
        serverHandler(res, newUser);
        break;
      }
      default:
        res.statusCode = 404;
        res.write('Invalid URL');
        res.end();
    }
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

const PORT = process.env.PORT || 3999;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
