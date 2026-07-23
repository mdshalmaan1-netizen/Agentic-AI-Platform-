import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import errorHandler from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

// Route Imports
import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import resumeRoutes from './modules/resume/resume.routes.js';
import jobsRoutes from './modules/jobs/jobs.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import interviewRoutes from './modules/interview/interview.routes.js';
import coverLetterRoutes from './modules/coverLetter/coverLetter.routes.js';
import roadmapRoutes from './modules/roadmap/roadmap.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import applicationsRoutes from './modules/applications/applications.routes.js';

const app = express();

// Global Middleware Stack
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    service: 'Agentic AI Backend Platform API',
  });
});

// API Routes (v1)
const apiRouter = express.Router();
apiRouter.use(apiRateLimiter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/resume', resumeRoutes);
apiRouter.use('/jobs', jobsRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/interview', interviewRoutes);
apiRouter.use('/cover-letter', coverLetterRoutes);
apiRouter.use('/roadmap', roadmapRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/notifications', notificationsRoutes);
apiRouter.use('/applications', applicationsRoutes);

app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
