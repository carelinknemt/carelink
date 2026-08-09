import express from 'express';
import { SERVER_CONFIG } from './config/config.js';
import dispatchRoutes from './routes/dispatchRoutes.js';

export function createExpressApp() {
  const app = express();
  app.use(express.json());

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: SERVER_CONFIG.companyName,
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API V1 routes
  app.use(`${SERVER_CONFIG.apiPrefix}/dispatch`, dispatchRoutes);

  return app;
}
