import { IsNotEmpty, IsString } from 'class-validator';
export class CreateProcessTypeDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}
