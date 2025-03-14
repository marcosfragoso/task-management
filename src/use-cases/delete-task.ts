/* eslint-disable prettier/prettier */
import { TaskRepository } from "../repositories/task-repository";

export class DeleteTaskUseCase {
    private taskRepository: TaskRepository;
  
    constructor(taskRepository: TaskRepository) {
      this.taskRepository = taskRepository;
    }
  
    async execute(id: string): Promise<void> {
      const task = await this.taskRepository.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      await this.taskRepository.delete(id);
    }
  }
  