/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { Task } from '../entities/task';
import { TaskRepository } from './task-repository';

const prisma = new PrismaClient();

export class PrismaTaskRepository implements TaskRepository {
  async create(task: Task): Promise<Task> {
    const createdTask = await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        expirationDate: task.expirationDate,
      },
    });
    return new Task(
      createdTask.title,
      createdTask.description,
      createdTask.status,
      createdTask.expirationDate
    );
  }

  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });
  
    if (!task) return null;
  
    
    const { title, description, status, expirationDate } = task;
    return new Task(title, description, status, expirationDate, id); 
  }

  async update(task: Task): Promise<void> {
    const existingTask = await prisma.task.findUnique({
        where: { id: task.id },
    });

    if (!existingTask) {
        throw new Error(`Task not found. ID: ${task.id}`);
    }

    await prisma.task.update({
        where: { id: task.id },
        data: {
            title: task.title,
            description: task.description,
            status: task.status,
            expirationDate: task.expirationDate,
        },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Task[]> {
    const tasks = await prisma.task.findMany();
    return tasks.map(
      (task) =>
        new Task(task.title, task.description, task.status, task.expirationDate)
    );
  }
}
