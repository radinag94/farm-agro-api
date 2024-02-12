import { IsString } from 'class-validator';

export class CreateSoilDto {
  @IsString()
  type: string;
}
