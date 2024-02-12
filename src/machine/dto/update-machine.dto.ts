import { PartialType } from '@nestjs/mapped-types';
import { CreateMachineDto } from './create-machine.dto';
import {
  IsString,
  IsUUID,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMachineDto extends PartialType(CreateMachineDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @MaxLength(10, { message: 'Please provide a valid register number' })
  @MinLength(4, { message: 'Please provide a valid register number' })
  @IsString()
  registerNumber: string;

  @IsOptional()
  @IsUUID()
  farmId: string;
}
