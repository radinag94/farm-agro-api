import { PartialType } from '@nestjs/mapped-types';
import { CreateSoilDto } from './create-soil.dto';
import { IsString } from 'class-validator';

export class UpdateSoilDto extends PartialType(CreateSoilDto) {
  @IsString()
  type: string;
}
