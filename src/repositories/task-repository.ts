/* eslint-disable prettier/prettier */
import { Task } from "../entities/task";


export interface TaskRepository {
    create(task: Task): Promise<Task>;
    findById(id: string): Promise<Task | null>;
    update(task: Task): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Task[]>;
}