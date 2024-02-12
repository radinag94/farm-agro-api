import { IsDateString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateFieldProcessDto {
  @IsNotEmpty()
  @IsDateString()
  pDate: Date;

  @IsNotEmpty()
  @IsUUID()
  machineId: string;

  @IsNotEmpty()
  @IsUUID()
  processTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  growingPeriodId: string;
}
