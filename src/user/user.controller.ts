import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.tro';
import { AuthService } from '../auth/auth.service';
import { SignInDto } from './dtos/signin-user.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from './user-role.enum';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';

@UseGuards(RolesGuard)
@Controller('auth')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(@Body() body: SignInDto) {
    const user = await this.authService.signin(body.email, body.password);
    return user;
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }
  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for user ${id}`);
    return this.userService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for user ${id}`);
    return this.userService.removeSoft(id);
  }

  @Roles(UserRole.OWNER)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }
}
