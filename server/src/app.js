import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
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

// --- Error handler (must be last) ---
app.use(errorHandler);

export default app;
