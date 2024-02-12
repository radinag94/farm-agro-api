import {
  IsString,
  IsObject,
  IsNumber,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateFieldDto {
  @MinLength(2, { message: 'The field name you provided is too short' })
  @MaxLength(20, { message: 'The field name you provided is too long' })
  @IsString()
  name: string;

  @IsObject()
  shape: {
    type: 'Polygon' | 'Multypolygon';
    coordinates: number[][][] | number[][][][];
  };
  @IsNumber()
  fieldArea: number;

  @IsUUID()
  soilId: string;

  @IsUUID()
  farmId: string;
}
