import http from 'http';
import app from './app.js';
import config from './config/index.js';
import sequelize from './config/db.js';
import { setupAssociations } from './db/associations.js';
import { createSocketServer } from './config/socket.js';
import { registerSockets } from './sockets/index.js';

// Prevent unhandled promise rejections from crashing the server.
// These can originate from Socket.IO handlers or other async code
// outside Express middleware. Log them but keep the process alive.
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
});

const server = http.createServer(app);
const io = createSocketServer(server);

// Register Socket.IO event handlers
registerSockets(io);

// Setup model associations
setupAssociations();

async function start() {
  // Connect to DB — fail fast if unreachable
  try {
    await sequelize.authenticate();
    console.log(`[DB] Connected to mysql://${config.db.host}:${config.db.port}/${config.db.name} as ${config.db.user}`);

    // In development with DB_SYNC_ALTER=true, run ALTER to adjust columns.
    // Otherwise, just ensure tables exist (non-destructive).
    if (config.nodeEnv === 'development' && config.db.syncAlter) {
      console.log('[DB] Running sync with ALTER (DB_SYNC_ALTER=true)...');
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync();
    }
    console.log('[DB] Models synced');
  } catch (err) {
    console.error('[DB] Failed to connect to MySQL.');
    console.error('[DB] Verify DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD in .env and ensure MySQL is running.');
    console.error('[DB] Error details:', err.message);
    process.exit(1);
  }

  server.listen(config.port, () => {
    console.log(`[Server] Running on http://localhost:${config.port}`);
  });
}

start();

