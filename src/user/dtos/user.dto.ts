import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
export class UserDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  email: string;
}
