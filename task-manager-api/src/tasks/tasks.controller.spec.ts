import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('delegates task CRUD operations to TasksService', () => {
    const task = controller.create({ title: 'Write tests' });

    expect(controller.findAll()).toEqual([task]);
    expect(controller.findOne(task.id)).toBe(task);
    expect(controller.update(task.id, { completed: true }).completed).toBe(
      true,
    );
    expect(controller.remove(task.id).message).toContain(
      'removed successfully',
    );
    expect(controller.findAll()).toEqual([]);
  });
});
