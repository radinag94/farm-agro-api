import { IsUUID, IsString } from 'class-validator';

export class CreateGrowingPeriodDto {
  @IsString()
  @IsUUID()
  cropId: string;

  @IsString()
  @IsUUID()
  fieldId: string;

  @IsString()
  @IsUUID()
  machineId: string;
  @IsString()
  @IsUUID()
  processTypeId: string;
}
