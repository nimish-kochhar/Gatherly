import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsOptions } from './config/cors.js';
import config from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Feature routes
import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/user/user.routes.js';
import postRoutes from './features/post/post.routes.js';
import communityRoutes from './features/community/community.routes.js';
import chatRoutes from './features/chat/chat.routes.js';
import searchRoutes from './features/search/search.routes.js';
import mediaRoutes from './features/media/media.routes.js';
import feedRoutes from './features/feed/feed.routes.js';

const app = express();

// --- Global middleware ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/feed', feedRoutes);

// --- Health check ---
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// --- Production: serve built React client ---
if (config.nodeEnv === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.resolve(__dirname, '../../client/dist');

  app.use(express.static(clientDist));

  // SPA fallback — any non-API GET that doesn't match a static file
  // returns index.html so React Router can handle the route.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// --- Error handler (must be last) ---
app.use(errorHandler);

export default app;

