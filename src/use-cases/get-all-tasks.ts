/* eslint-disable prettier/prettier */
import { Task } from "../entities/task";
import { TaskRepository } from "../repositories/task-repository";


export class GetAllTasksUseCase {
    private taskRepository: TaskRepository;
  
    constructor(taskRepository: TaskRepository) {
      this.taskRepository = taskRepository;
    }
  
    async execute(): Promise<Task[]> {
      return this.taskRepository.findAll();
    }
  }
  