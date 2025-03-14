/* eslint-disable prettier/prettier */
import { Task } from "../entities/task";
import { TaskRepository } from "../repositories/task-repository";


export class GetTaskUseCase {
    private taskRepository: TaskRepository;
  
    constructor(taskRepository: TaskRepository) {
      this.taskRepository = taskRepository;
    }
  
    async execute(id: string): Promise<Task | null> {
      return this.taskRepository.findById(id);
    }
  }
  