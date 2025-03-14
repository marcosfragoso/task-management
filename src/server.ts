/* eslint-disable prettier/prettier */
import fastify from 'fastify';
import { taskRoutes } from './controllers/task-controller';

const app = fastify();


app.register(taskRoutes);


const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('HTTP Server Running on http://localhost:3333');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
