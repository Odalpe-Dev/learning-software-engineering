// src/app.ts
import express from 'express';
import { traceMiddleware } from './middleware/trace.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import userRoutes from './routes/users.routes';
import { NotFoundException } from './exceptions/not-found.exception';

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de trazabilidad
app.use(traceMiddleware);

// Middleware de logging
app.use(loggerMiddleware);

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-trace-id');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    traceId: req.traceId,
    status: 200,
    code: 'HEALTH_CHECK',
    message: 'Servicio funcionando correctamente',
    data: {
      timestamp: new Date(),
      uptime: process.uptime()
    }
  });
});

// Rutas de la API
app.use('/api', userRoutes);

// Manejador de rutas no encontradas
app.use((req, res, next) => {
  next(new NotFoundException('Ruta no encontrada'));
});

// Manejador global de errores
app.use(errorHandler);

export default app;