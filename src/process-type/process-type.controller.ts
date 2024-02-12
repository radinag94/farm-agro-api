import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UpdateProcessTypeDto } from './dto/update-process-type.dto';
import { ProcessTypeService } from './process-type.service';
import { CreateProcessTypeDto } from './dto/create-process-type.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@UseGuards(RolesGuard)
@Controller('process-type')
export class ProcessTypeController {
  constructor(private readonly processTypeService: ProcessTypeService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/create')
  async create(@Body() body: CreateProcessTypeDto) {
    const processType = await this.processTypeService.create(body.type);
    return processType;
  }

  @Get()
  findAll(@Query('type') type: string) {
    return this.processTypeService.findAll(type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const processType = await this.processTypeService.findOne(id);
    if (!processType) {
      throw new NotFoundException('not found process type');
    }
    return processType;
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProcessTypeDto: UpdateProcessTypeDto,
  ) {
    return this.processTypeService.update(id, updateProcessTypeDto);
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for process type with id: ${id}`);
    return this.processTypeService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for process type with id: ${id}`);
    return this.processTypeService.removeSoft(id);
  }
}
