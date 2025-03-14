/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CreateTaskUseCase } from '../use-cases/create-task';
import { PrismaTaskRepository } from '../repositories/prisma-task-repository'; 
import { UpdateTaskUseCase } from '../use-cases/update-task';

const prisma = new PrismaClient();

export async function taskRoutes(app: FastifyInstance) {
  app.post('/tasks', async (request, reply) => {
    try {
      const { title, description, status, expirationDate } = request.body as {
        title: string;
        description: string;
        status: string;
        expirationDate: string;
      };

      const prismaTaskRepository = new PrismaTaskRepository();

      const createTaskUseCase = new CreateTaskUseCase(prismaTaskRepository);

      const task = await createTaskUseCase.execute({
        title,
        description,
        status,
        expirationDate: new Date(expirationDate),
      });

      return reply.status(201).send(task);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Error creating a task' });
    }
  });

  app.get('/tasks', async (_, reply) => {
    try {
      const tasks = await prisma.task.findMany();
      return reply.send(tasks);
    } catch (error) {
      return reply.status(500).send({ error: 'Error when searching for tasks' });
    }
  });

  app.get('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) {
        return reply.status(404).send({ error: 'Task not found' });
      }
      return reply.send(task);
    } catch (error) {
      return reply.status(500).send({ error: 'Error when searching for task' });
    }
  });

  app.delete('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.task.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({ error: 'Error deleting task' });
    }
  });

  app.put('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status?: "Pendente" | "Em andamento" | "Concluído" };
  
    try {
      const prismaTaskRepository = new PrismaTaskRepository();
      const updateTaskUseCase = new UpdateTaskUseCase(prismaTaskRepository);
  

      if (status && !["Pendente", "Em andamento", "Concluído"].includes(status)) {
        return reply.status(400).send({ error: "Invalid status" });
      }

      const updatedTask = await updateTaskUseCase.execute({
        id,
        status, 
      });
  
      return reply.status(200).send(updatedTask);
  
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Error updating task" });
    }
  });
  
  
}
