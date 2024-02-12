import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldProcessDto } from './create-field-process.dto';
import { IsOptional, IsDateString, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateFieldProcessDto extends PartialType(CreateFieldProcessDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  pDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  machineId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  processTypeId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  growingPeriodId: string;
}
