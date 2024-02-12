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
import { SoilService } from './soil.service';
import { CreateSoilDto } from './dto/create-soil.dto';
import { UpdateSoilDto } from './dto/update-soil.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@UseGuards(RolesGuard)
@Controller('soil')
export class SoilController {
  constructor(private readonly soilService: SoilService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/add-soil')
  async create(@Body() body: CreateSoilDto) {
    const soil = await this.soilService.create(body.type);
    return soil;
  }

  @Get()
  findAllSoils(@Query('type') type: string) {
    return this.soilService.findAll(type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const soil = await this.soilService.findOne(id);
    if (!soil) {
      throw new NotFoundException('not found soil');
    }
    return soil;
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSoilDto: UpdateSoilDto) {
    return this.soilService.update(id, updateSoilDto);
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for soil ${id}`);
    return this.soilService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for soil ${id}`);
    return this.soilService.removeSoft(id);
  }
}
