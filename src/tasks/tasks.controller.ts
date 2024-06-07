import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RequestAuth } from 'src/common/types/request.type';
import { TasksService } from './tasks.service';
import { TaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Req() req: RequestAuth, @Body() dto: TaskDto) {
    return await this.tasksService.createTask(dto, req.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTasks(@Req() req: RequestAuth, @Query() query: any) {
    return await this.tasksService.getTasks(req.user.id, query);
  }

  @Put('/:taskId')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Req() req: RequestAuth,
    @Body() dto: UpdateTaskDto,
    @Param('taskId') taskId: string,
  ) {
    return await this.tasksService.updateTask(taskId, dto, req.user.id);
  }

  @Delete('/:taskId')
  @HttpCode(HttpStatus.OK)
  async deleteTask(@Req() req: RequestAuth, @Param('taskId') taskId: string) {
    return await this.tasksService.deleteTask(taskId, req.user.id);
  }
}
