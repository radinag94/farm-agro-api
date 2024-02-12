import { IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCropDto } from './create-crop.dto';

export class UpdateCropDto extends PartialType(CreateCropDto) {
  @MaxLength(15, {
    message: 'The crop name is too long - please provide a valid name ',
  })
  @IsString()
  name: string;
}
