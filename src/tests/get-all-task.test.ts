/* eslint-disable prettier/prettier */
import { GetAllTasksUseCase } from "../use-cases/get-all-tasks";
import { Task } from "../entities/task";
import { TaskRepository } from "../repositories/task-repository";

jest.mock("../repositories/task-repository");

describe("GetAllTasksUseCase", () => {
  let getAllTasksUseCase: GetAllTasksUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    taskRepository = {
        create: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
    };

    getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
  });

  it("Should return all tasks", async () => {

    const taskMock1 = new Task("Task 1", "Description 1", "Pendente", new Date("2026-01-01"));
    const taskMock2 = new Task("Task 2", "Description 2", "Em andamento", new Date("2026-02-01"));

    taskRepository.findAll.mockResolvedValue([taskMock1, taskMock2]);

    const tasks = await getAllTasksUseCase.execute();

    expect(taskRepository.findAll).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([taskMock1, taskMock2]);
  });

  it("Should return an empty array if no tasks are found", async () => {
    taskRepository.findAll.mockResolvedValue([]);

    const tasks = await getAllTasksUseCase.execute();

    expect(taskRepository.findAll).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([]);
  });
});
