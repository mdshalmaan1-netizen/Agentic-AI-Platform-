import http from 'http';
import app from './app.js';
import config from './config/index.js';
import { initSocket } from './config/socket.js';

const server = http.createServer(app);

// Initialize Socket.IO Real-time Server
initSocket(server);

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`
🚀 Agentic AI Enterprise Backend is running!
---------------------------------------------
📡 Server URL:   http://localhost:${PORT}
🔗 Health Check: http://localhost:${PORT}/health
⚡ Environment:  ${config.env}
---------------------------------------------
  `);
});
