import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldDto } from './create-field.dto';
import {
  IsString,
  IsObject,
  IsNumber,
  IsUUID,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateFieldDto {
  @MinLength(2, { message: 'The field name you provided is too short' })
  @MaxLength(20, { message: 'The field name you provided is too long' })
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsObject()
  shape: {
    type: 'Polygon' | 'Multypolygon';
    coordinates: number[][][] | number[][][][];
  };

  @IsNumber()
  @IsOptional()
  fieldArea?: number;

  @IsUUID()
  @IsOptional()
  soilId?: string;

  @IsUUID()
  @IsOptional()
  farmId?: string;
}
