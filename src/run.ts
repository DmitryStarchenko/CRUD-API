import { createServer } from './server.ts';

const PORT = Number(process.env.PORT) || 3999;
const server = createServer(PORT);
server.listen(PORT, () => {
  console.log(`Single server is listening on port ${PORT}`);
});
