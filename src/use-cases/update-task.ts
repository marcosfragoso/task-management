/* eslint-disable prettier/prettier */
import { TaskRepository } from "../repositories/task-repository";

interface UpdateTaskUseCaseRequest {
  id: string;
  title?: string;
  description?: string;
  status?: "Pendente" | "Em andamento" | "Concluído";
  expirationDate?: Date;
}

export class UpdateTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ id, title, description, status, expirationDate }: UpdateTaskUseCaseRequest): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error(`Task not found. ID: ${id}`);
    }

    const now = new Date();
    const isExpired = expirationDate && new Date(expirationDate) < now;

    if (status) {
      if (!["Pendente", "Em andamento", "Concluído"].includes(status)) {
        throw new Error('Invalid status. Use only "Pendente", "Em andamento" or "Concluído".');
      }

      if (status === "Pendente" && task.status !== "Pendente") {
        throw new Error('Unable to return to "Pendente".');
      }

      if (status === "Em andamento" && task.status !== "Pendente") {
        throw new Error('To mark as "Em andamento", the task must be in "Pendente".');
      }

      if (status === "Concluído" && task.status !== "Em andamento") {
        throw new Error('A task can only be marked as "Concluído" if it is "Em andamento".');
      }

      if (isExpired) {
        if (status === "Pendente" || status === "Em andamento") {
          throw new Error("You cannot set an overdue task to 'Pendente' or 'Em andamento'.");
        }
      }
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.expirationDate = expirationDate ?? task.expirationDate;

    await this.taskRepository.update(task);
  }
}
