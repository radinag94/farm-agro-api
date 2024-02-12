import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/user/user-role.enum';
import { Roles } from 'src/user/decorators/roles.decorator';
import { NotFoundException } from '@nestjs/common';

@UseGuards(RolesGuard)
@Controller('crop')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/create')
  async create(@Body() body: CreateCropDto) {
    const crop = await this.cropService.create(body.name);
    return crop;
  }

  @Get()
  findAllCrops(@Query('name') name: string) {
    return this.cropService.findAll(name);
  }

  @Get('/:id')
  async findCrop(@Param('id') id: string) {
    const crop = await this.cropService.findOne(id);
    if (!crop) {
      throw new NotFoundException('Crop not found');
    }
    return crop;
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropService.update(id, updateCropDto);
  }
  @Get('/byField/:fieldId')
  async findCropsByFieldId(@Param('fieldId') fieldId: string) {
    const crop = await this.cropService.findCropsByFieldId(fieldId);
    if (!crop) {
      throw new NotFoundException('No crop found for the specified field');
    }
    return crop;
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for crop with id :${id}`);
    return this.cropService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for crop with id:${id}`);
    return this.cropService.removeSoft(id);
  }
}
