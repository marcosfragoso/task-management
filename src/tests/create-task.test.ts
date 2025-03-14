/* eslint-disable prettier/prettier */
import { CreateTaskUseCase } from "../use-cases/create-task";
import { Task } from "../entities/task";
import { TaskRepository } from "../repositories/task-repository";


jest.mock("../repositories/task-repository");

describe("CreateTaskUseCase", () => {
  let createTaskUseCase: CreateTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    
    taskRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    createTaskUseCase = new CreateTaskUseCase(taskRepository);
  });

  it("Should create a new task", async () => {
    const taskMock = new Task(
      "Test Task",
      "Test Description",
      "Pendente",
      new Date("2026-01-01")
    );
    
    
    taskRepository.create.mockResolvedValue(taskMock);

    const result = await createTaskUseCase.execute({
      title: "Test Task",
      description: "Test Description",
      status: "Pendente",
      expirationDate: new Date("2026-01-01"),
    });

    expect(result).toEqual(taskMock);
    expect(taskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      title: "Test Task",
      description: "Test Description",
    }));
  });

  it("Should throw error when create task fails", async () => {
    taskRepository.create.mockRejectedValue(new Error("Database error"));

    await expect(
      createTaskUseCase.execute({
        title: "Test Task",
        description: "Test Description",
        status: "Pendente",
        expirationDate: new Date("2026-01-01"),
      })
    ).rejects.toThrow("Database error");
  });

  it("Should not create a task with an expiration date earlier than the current date", async () => {
    
    const expirationDateInThePast = new Date();
    expirationDateInThePast.setDate(expirationDateInThePast.getDate() - 1); 
  
    
    await expect(
      createTaskUseCase.execute({
        title: "Test Task",
        description: "Test Description",
        status: "Pendente",
        expirationDate: expirationDateInThePast,
      })
    ).rejects.toThrow("You cannot create a task that has already expired.");
  });
  

});

