import { IsString, MaxLength } from 'class-validator';
export class CreateCropDto {
  @MaxLength(15, {
    message: 'The crop name is too long - please provide a valid name ',
  })
  @IsString()
  name: string;
}
