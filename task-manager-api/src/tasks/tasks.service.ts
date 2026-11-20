import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto.js';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];
  private nextId = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((candidate) => candidate.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      ...(dto.description === undefined
        ? {}
        : { description: dto.description }),
      completed: false,
    };
    this.tasks.push(task);

    return task;
  }

  update(id: number, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, dto);
    return task;
  }

  remove(id: number): { message: string } {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.tasks.splice(index, 1);
    return { message: `Task with id ${id} removed successfully` };
  }
}
