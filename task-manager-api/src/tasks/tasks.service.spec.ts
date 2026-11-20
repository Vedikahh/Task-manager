import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto.js';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('creates tasks with incrementing ids and a default incomplete status', () => {
    const first = service.create({ title: 'First task' });
    const second = service.create({
      title: 'Second task',
      description: 'Details',
    });

    expect(first).toEqual({
      id: 1,
      title: 'First task',
      completed: false,
    });
    expect(second).toEqual({
      id: 2,
      title: 'Second task',
      description: 'Details',
      completed: false,
    });
    expect(service.findAll()).toHaveLength(2);
  });

  it('finds, updates, and removes a task', () => {
    const created = service.create({ title: 'Old title' });

    expect(service.findOne(created.id)).toBe(created);
    expect(
      service.update(created.id, {
        title: 'New title',
        completed: true,
      } satisfies UpdateTaskDto),
    ).toEqual({ ...created, title: 'New title', completed: true });
    expect(service.remove(created.id).message).toContain(
      'removed successfully',
    );
    expect(service.findAll()).toEqual([]);
  });

  it('throws NotFoundException when finding, updating, or removing a missing task', () => {
    const dto: CreateTaskDto = { title: 'Missing task' };

    expect(() => service.findOne(42)).toThrow(NotFoundException);
    expect(() => service.update(42, dto)).toThrow(NotFoundException);
    expect(() => service.remove(42)).toThrow(NotFoundException);
  });
});
