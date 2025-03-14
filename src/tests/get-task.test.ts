/* eslint-disable prettier/prettier */
import { GetTaskUseCase } from "../use-cases/get-task";
import { Task } from "../entities/task";
import { TaskRepository } from "../repositories/task-repository";

jest.mock("../repositories/task-repository");

describe("GetTaskUseCase", () => {
  let getTaskUseCase: GetTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    taskRepository = {
        create: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
    };

    getTaskUseCase = new GetTaskUseCase(taskRepository);
  });

  it("Should return the task if found", async () => {
    
    const taskMock = new Task("Test Task", "Test Description", "Pendente", new Date("2025-01-01"));
    const generatedId = taskMock.id; 
  
    taskRepository.findById.mockResolvedValue(taskMock);
  
    const task = await getTaskUseCase.execute(generatedId);
  
    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith(generatedId);
    
    expect(task).toEqual(taskMock);
  });
  

  it("Should return null when trying to get a task with a non-existing ID", async () => {
    taskRepository.findById.mockResolvedValue(null);
  
    const nonExistingId = "nonexistent-id";
  
    const task = await getTaskUseCase.execute(nonExistingId);
  
    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith(nonExistingId);
  
    expect(task).toBeNull();
  });
  
});
