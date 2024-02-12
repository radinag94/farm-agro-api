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
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/create')
  async createFarm(@Body() body: CreateFarmDto) {
    const farm = await this.farmService.create({
      name: body.name,
      latitude: body.latitude,
      longitude: body.longitude,
    });
    return farm;
  }

  @Get()
  findAllFarms(@Query('name') name: string) {
    return this.farmService.findAll(name);
  }

  @Get(':id')
  async findOneFarm(@Param('id') id: string) {
    const farm = await this.farmService.findOne(id);
    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
    return farm;
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.update(id, updateFarmDto);
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for farm with id :${id}`);
    return this.farmService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for farm with id:${id}`);
    return this.farmService.removeSoft(id);
  }
}
