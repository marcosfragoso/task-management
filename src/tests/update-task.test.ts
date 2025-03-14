/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { UpdateTaskUseCase } from "../use-cases/update-task";
import { Task } from "../entities/task";
import { TaskRepository } from "../repositories/task-repository";

jest.mock("../repositories/task-repository");

describe("UpdateTaskUseCase", () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    taskRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  });

  it("Should throw an error if task is not found", async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(
      updateTaskUseCase.execute({
        id: "1",
        title: "Updated Task",
      })
    ).rejects.toThrow("Task not found. ID: 1");
  });

  it("Should throw an error if status is invalid", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Pendente",
      new Date("2025-01-01")
    );

    taskRepository.findById.mockResolvedValue(taskMock);

    await expect(
      updateTaskUseCase.execute({
        id: "1",
        status: "InvalidStatus" as any,
      })
    ).rejects.toThrow('Invalid status. Use only "Pendente", "Em andamento" or "Concluído".');
  });

  it("Should throw an error if trying to set status 'Pendente' on a task not 'Pendente'", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Em andamento",
      new Date("2025-01-01")
    );

    taskRepository.findById.mockResolvedValue(taskMock);

    await expect(
      updateTaskUseCase.execute({
        id: "1",
        status: "Pendente",
      })
    ).rejects.toThrow('Unable to return to "Pendente".');
  });

  it("Should throw an error if trying to set status 'Em andamento' on a task not 'Pendente'", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Concluído",
      new Date("2025-01-01")
    );

    taskRepository.findById.mockResolvedValue(taskMock);

    await expect(
      updateTaskUseCase.execute({
        id: "1",
        status: "Em andamento",
      })
    ).rejects.toThrow('To mark as "Em andamento", the task must be in "Pendente".');
  });

  it("Should throw an error if trying to set status 'Concluído' on a task not 'Em andamento'", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Pendente",
      new Date("2025-01-01")
    );

    taskRepository.findById.mockResolvedValue(taskMock);

    await expect(
      updateTaskUseCase.execute({
        id: "1",
        status: "Concluído",
      })
    ).rejects.toThrow('A task can only be marked as "Concluído" if it is "Em andamento".');
  });

  it("Should throw an error if trying to set a task with expired date as 'Pendente' or 'Em andamento'", async () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); 

    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Pendente",
      expiredDate
    );

    taskRepository.findById.mockResolvedValue(taskMock);

    await expect(
      updateTaskUseCase.execute({
        id: "1",
        status: "Em andamento",
        expirationDate: expiredDate,
      })
    ).rejects.toThrow("You cannot set an overdue task to 'Pendente' or 'Em andamento'.");

    await expect(
      updateTaskUseCase.execute({
        id: "1",
        status: "Em andamento",
        expirationDate: expiredDate,
      })
    ).rejects.toThrow("You cannot set an overdue task to 'Pendente' or 'Em andamento'.");
  });

  it("Should successfully update multiple fields of a task", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Pendente",
      new Date("2026-01-01")
    );
  
    const newExpirationDate = new Date("2026-02-01");
  
    taskRepository.findById.mockResolvedValue(taskMock);
    taskRepository.update.mockResolvedValue();
  
    await updateTaskUseCase.execute({
      id: "1",
      title: "Updated Task Title",
      description: "Updated Task Description",
      status: "Em andamento",
      expirationDate: newExpirationDate,
    });
  
    expect(taskMock.title).toBe("Updated Task Title");
    expect(taskMock.description).toBe("Updated Task Description");
    expect(taskMock.status).toBe("Em andamento");
    expect(taskMock.expirationDate).toEqual(newExpirationDate);
    expect(taskRepository.update).toHaveBeenCalledTimes(1);
  });

  it("Should successfully update task status from 'Em andamento' to 'Concluído'", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Em andamento", 
      new Date("2026-01-01")
    );
  
    const newStatus = "Concluído";
  
    taskRepository.findById.mockResolvedValue(taskMock);
    taskRepository.update.mockResolvedValue();
  
    await updateTaskUseCase.execute({
      id: "1",
      status: newStatus, 
    });
  
    expect(taskMock.status).toBe(newStatus); 
    expect(taskRepository.update).toHaveBeenCalledTimes(1); 
  });
  
  
});
