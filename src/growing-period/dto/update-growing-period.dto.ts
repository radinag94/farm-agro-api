import { PartialType } from '@nestjs/mapped-types';
import { CreateGrowingPeriodDto } from './create-growing-period.dto';
import { IsOptional, IsUUID, IsString, MaxLength } from 'class-validator';

export class UpdateGrowingPeriodDto extends PartialType(
  CreateGrowingPeriodDto,
) {
  @IsUUID()
  @IsOptional()
  cropId: string;

  @IsUUID()
  @IsOptional()
  fieldId: string;

  @IsString()
  @MaxLength(20, { message: 'The crop name you provided is too long' })
  @IsOptional()
  cropName: string;
}
