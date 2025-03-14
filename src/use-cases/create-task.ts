/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { TaskRepository } from "../repositories/task-repository";
import { Task } from "../entities/task";

interface CreateTaskUseCaseRequest {
    title: string;
    description: string;
    status: string;
    expirationDate: Date;
}

export class CreateTaskUseCase {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute({ title, description, status, expirationDate }: CreateTaskUseCaseRequest): Promise<Task> {
        const now = new Date();
        const isExpired = expirationDate && new Date(expirationDate) < now;

        if (isExpired) {
            throw new Error("You cannot create a task that has already expired.");
        }

        const task = new Task(title, description, status, expirationDate);
        return this.taskRepository.create(task);
    }
}

