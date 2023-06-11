import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1', routes);

// Testing
app.get('/api/v1', async (req: Request, res: Response) => {
  // throw new Error('Testing error logger')
  res.send('hey from Aitch university auth');
});

// global error handler
app.use(globalErrorHandler);

// Handle not found
app.use((req: Request, res: Response, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [{ path: req.originalUrl, message: 'API Not Found' }],
  });
  next();
});

export default app;
