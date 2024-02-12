import {
  IsLatitude,
  IsString,
  IsLongitude,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
export class CreateFarmDto {
  @MinLength(2, { message: 'The farm name you provided is too short' })
  @MaxLength(20, { message: 'The farm name you provided is too long' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
}
