import { IsNotEmpty, IsString } from 'class-validator';

export class TransferMachineDto {
  @IsNotEmpty()
  @IsString()
  oldFarmId: string;

  @IsNotEmpty()
  @IsString()
  newFarmId: string;
}
