import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';
import 'reflect-metadata';
import './database';

import uploadConfig from './config/upload';

import routes from './routes';
import AppError from './errors/AppError';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // eslint-disable-next-line no-console
    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server started on port 3333!');
});
