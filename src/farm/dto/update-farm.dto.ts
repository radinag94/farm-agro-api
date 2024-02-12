import {
  IsString,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsObject,
  ValidateNested,
} from 'class-validator';

class Location {
  @IsNotEmpty()
  type: string;
  coordinates: number[];
}

export class UpdateFarmDto {
  @IsOptional()
  @MinLength(2, { message: 'The farm name you provided is too short' })
  @MaxLength(20, { message: 'The farm name you provided is too long' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  location?: Location;
}
