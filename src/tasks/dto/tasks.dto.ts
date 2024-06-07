import { IsBoolean, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { EFrequency } from 'src/common/utils/enums';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  tittle: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EFrequency)
  frequency: string;

  @IsBoolean()
  isPriority: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isDone: boolean;
}

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  isDone: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isPriority: boolean;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsBoolean()
  hasFrecuency: boolean;
}
