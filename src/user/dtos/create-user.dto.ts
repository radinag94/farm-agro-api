import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MaxLength(20, { message: 'The password you provided is too long' })
  @MinLength(5, { message: 'The password you provided is too short' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
