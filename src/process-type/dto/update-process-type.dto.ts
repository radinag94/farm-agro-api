import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessTypeDto } from './create-process-type.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProcessTypeDto extends PartialType(CreateProcessTypeDto) {
  @IsOptional()
  @IsString()
  type: string;
}
