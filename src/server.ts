import http from 'http';
import { GET } from './methods/GET.ts';
import { POST } from './methods/POST.ts';
import { serverHandler } from './utils/serverHandler.ts';
import { PUT } from './methods/PUT.ts';
import { DELETE } from './methods/DELETE.ts';

export const createServer = (port?: number) => {
  const server = http.createServer();

  server.on('request', async (req, res) => {
    const url = req.url?.split('/').slice(0, 3).join('/');
    res.setHeader('Content-Type', 'application/json');
    try {
      if (url === '/api/users') {
        switch (req.method) {
          case 'GET': {
            const getUser = GET(req.url ? req.url : '');
            serverHandler(res, getUser);
            break;
          }
          case 'POST': {
            const newUser = await POST(req);
            serverHandler(res, newUser);
            break;
          }
          case 'PUT': {
            const updateUser = await PUT(req);
            serverHandler(res, updateUser);
            break;
          }
          case 'DELETE': {
            const message = DELETE(req.url ? req.url : '');
            serverHandler(res, message);
            break;
          }
          default:
            res.statusCode = 404;
            res.write('Invalid URL');
            res.end();
        }
      } else {
        res.statusCode = 404;
        res.write('Invalid URL');
        res.end();
      }
    } catch {
      res.statusCode = 500;
      res.end(JSON.stringify('Internal server error'));
    }
  });

  server.on('error', (err) => {
    console.error(`Server on port ${port} error:`, err);
  });

  return server;
};
