import cluster from 'cluster';
import os from 'os';
import http from 'http';
import { createServer } from './server.ts';

const numCPUs = os.cpus().length;
const basePort = parseInt(process.env.CLUSTER_PORT || '4000');
const workerCount = numCPUs - 1;

if (cluster.isPrimary) {
  console.log(`Forking ${workerCount} workers`);

  const ports = Array.from({ length: workerCount }, (_, i) => basePort + i + 1);
  let current = 0;

  const loadBalancer = http.createServer((req, res) => {
    const workerPort = ports[current];
    console.log(`Routing request to worker on port ${workerPort}`);

    const proxyReq = http.request(
      {
        hostname: 'localhost',
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );

    proxyReq.on('error', (err) => {
      console.error('Load balancer error:', err);
      res.statusCode = 500;
      res.end('Load balancer error');
    });
    req.pipe(proxyReq);
    current = (current + 1) % workerCount;
  });

  loadBalancer.listen(basePort, () => {
    console.log(`Load balancer listening on port ${basePort}`);
  });

  for (let i = 0; i < workerCount; i++) {
    const workerPort = basePort + i + 1;
    cluster.fork({
      WORKER_PORT: workerPort.toString(),
      WORKER_ID: (i + 1).toString(),
    });
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    setTimeout(() => {
      cluster.fork();
    }, 1000);
  });
} else {
  const workerPort = parseInt(process.env.WORKER_PORT || '4001');
  const workerId = parseInt(process.env.WORKER_ID || '1');
  const server = createServer(workerPort);
  server.listen(workerPort, () => {
    console.log(`Worker ${workerId} is listening on port ${workerPort}`);
  });
}
