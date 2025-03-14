/* eslint-disable prettier/prettier */
import { DeleteTaskUseCase } from "../use-cases/delete-task";
import { TaskRepository } from "../repositories/task-repository";
import { Task } from "../entities/task";

jest.mock("../repositories/task-repository");

describe("DeleteTaskUseCase", () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    taskRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  });

  it("Should delete the task successfully if the task exists", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Pendente",
      new Date("2025-01-01")
    );

    taskRepository.findById.mockResolvedValue(taskMock);
    taskRepository.delete.mockResolvedValue(undefined); 

    await deleteTaskUseCase.execute("1");

    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith("1");
    expect(taskRepository.delete).toHaveBeenCalledTimes(1);
    expect(taskRepository.delete).toHaveBeenCalledWith("1");
  });

  it("Should throw an error if the task is not found", async () => {
    taskRepository.findById.mockResolvedValue(null); 

    await expect(deleteTaskUseCase.execute("nonexistent-id")).rejects.toThrow(
      "Task not found"
    );

    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith("nonexistent-id");
    expect(taskRepository.delete).toHaveBeenCalledTimes(0);
  });
});
