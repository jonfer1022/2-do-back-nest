import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { EFrequency } from 'src/common/utils/enums';
import { tasks } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async insertTask(dto: TaskDto, userId: string) {
    try {
      await this.prisma.tasks.create({
        data: {
          name: dto.tittle,
          description: dto.description,
          startDate: dto.startDate,
          endDate: dto.endDate,
          isPriority: dto.isPriority,
          isDone: dto.isDone,
          userId,
        },
      });
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ TasksService ~ insertTask ~ error:',
        message || error,
      );
      throw new Error('Failed to insert task: ' + error.message);
    }
  }

  async createTask(dto: TaskDto, userId: string) {
    try {
      const { frequency } = dto;
      if (frequency === EFrequency.NO_REPEAT) {
        await this.insertTask(dto, userId);
      }
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ TasksService ~ createTask ~ error:',
        message || error,
      );
      throw new Error('Failed to create task(s): ' + error.message);
    }
  }

  async getTasks(userId: string, query: any) {
    if (query.filter) {
      return await this.getTasksFiltered({ ...query });
    } else {
      return await this.getTasksHome(userId);
    }
  }

  private async getTasksHome(userId: string): Promise<{
    today: tasks[];
    tomorrow: tasks[];
    nextDays: tasks[];
    overdue: tasks[];
  }> {
    try {
      const tasks = await this.prisma.tasks.findMany({
        where: {
          userId,
          endDate: { gte: new Date() },
        },
        orderBy: { startDate: 'asc' },
        take: 10,
      });
      const overdue = await this.prisma.tasks.findMany({
        where: {
          userId,
          endDate: { lt: new Date() },
          isDone: false,
        },
        orderBy: { startDate: 'asc' },
        take: 10,
      });
      const today = tasks.filter((task) => {
        const { startDate } = task;
        return (
          moment(startDate).isSame(new Date(), 'day') &&
          moment(startDate).isSameOrAfter(new Date(), 'hours')
        );
      });
      const tomorrow = tasks.filter((task) => {
        const { startDate } = task;
        return moment(new Date())
          .add(1, 'days')
          .isSame(new Date(startDate), 'day');
      });
      const nextDays = tasks.filter((task) => {
        const { startDate } = task;
        return moment(new Date(startDate)).isAfter(
          moment(new Date()).add(1, 'days'),
          'day',
        );
      });
      return { today, tomorrow, nextDays, overdue };
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ TasksService ~ getTasks ~ error:',
        message || error,
      );
      throw new Error('Failed to get tasks: ' + error.message);
    }
  }

  private async getTasksFiltered({ textToSearch, priority, status }: any) {
    try {
      let _where: any = {};
      if (priority !== undefined && priority !== 'By default') {
        _where = {
          ..._where,
          isPriority: priority === 'By priority',
        };
      }
      if (status !== undefined && status !== 'By default') {
        _where = {
          ..._where,
          isDone: status === 'Done',
        };
      }
      if (textToSearch) {
        _where = {
          ..._where,
          OR: [
            { name: { contains: textToSearch, mode: 'insensitive' } },
            { description: { contains: textToSearch, mode: 'insensitive' } },
          ],
        };
      }

      const tasks = await this.prisma.tasks.findMany({
        where: { ..._where },
      });
      return tasks;
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ TasksService ~ getTasksFiltered ~ error:',
        message || error,
      );
      throw new Error('Failed to get tasks filtered: ' + error.message);
    }
  }
  async updateTask(taskId: string, dto: UpdateTaskDto, userId: string) {
    try {
      await this.prisma.tasks.update({
        where: { id: taskId, userId },
        data: {
          name: dto.name,
          description: dto.description,
          startDate: dto.startDate,
          endDate: dto.endDate,
          isPriority: dto.isPriority,
          isDone: dto.isDone,
          userId: userId,
        },
      });
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ TasksService ~ updateTask ~ error:',
        message || error,
      );
      throw new Error('Failed to update task: ' + error.message);
    }
  }

  async deleteTask(taskId: string, userId: string) {
    try {
      await this.prisma.tasks.delete({
        where: { id: taskId, userId },
      });
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ TasksService ~ deleteTask ~ error:',
        message || error,
      );
      throw new Error('Failed to delete task: ' + error.message);
    }
  }
}
