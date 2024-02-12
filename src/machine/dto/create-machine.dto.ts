import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  registerNumber: string;

  @IsNotEmpty()
  @IsUUID()
  farmId: string;
}
