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
  try {
    await sequelize.authenticate();
    console.log('[DB] Connected to MySQL');

    // Sync models in dev (use migrations in production)
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('[DB] Models synced');
    }

    server.listen(config.port, () => {
      console.log(`[Server] Running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

start();
