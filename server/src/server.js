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
    console.log(`[DB] Connected to mysql://${config.db.host}:${config.db.port}/${config.db.name} as ${config.db.user}`);

    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('[DB] Models synced');
    }
  } catch (err) {
    console.error('[DB] Failed to connect to MySQL.');
    console.error('[DB] Verify DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD in .env and ensure MySQL is running.');
    console.error('[DB] Error details:', err.message);
  }

  server.listen(config.port, () => {
    console.log(`[Server] Running on http://localhost:${config.port}`);
  });
}

start();
