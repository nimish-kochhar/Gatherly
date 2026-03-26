import http from 'http';
import app from './app.js';
import config from './config/index.js';
import sequelize from './config/db.js';
import { createSocketServer } from './config/socket.js';
import { registerSockets } from './sockets/index.js';

const server = http.createServer(app);
const io = createSocketServer(server);

// Register Socket.IO event handlers
registerSockets(io);

async function start() {
  // Try to connect to DB, but start the server regardless
  try {
    await sequelize.authenticate();
    console.log('[DB] Connected to MySQL');

    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('[DB] Models synced');
    }
  } catch (err) {
    console.warn('[DB] Could not connect to MySQL — running without database.');
    console.warn('[DB] Start MySQL or run: docker compose up -d');
    console.warn('[DB] Error:', err.message);
  }

  server.listen(config.port, () => {
    console.log(`[Server] Running on http://localhost:${config.port}`);
  });
}

start();
