import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { UpdateCropDto } from 'src/crop/dto/update-crop.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { UpdateResult } from 'typeorm';
import { Soil } from 'src/soil/entities/soil.entity';
import { Field } from './entities/field.entity';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/create')
  async create(@Body() createFieldDto: CreateFieldDto) {
    try {
      const createdField = await this.fieldService.create(
        createFieldDto.name,
        createFieldDto.shape,
        createFieldDto.fieldArea,
        createFieldDto.farmId,
        createFieldDto.soilId,
      );
      return { success: true, data: createdField };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  findAll(@Query('name') name: string) {
    return this.fieldService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldService.findOne(id);
  }

  @Get('/byFarmId/:farmId')
  findFieldsByFarmId(@Param('farmId') farmId: string) {
    return this.fieldService.findFieldsByFarmId(farmId);
  }
  @Get('/byFieldId/:fieldId')
  findFarmsByFieldId(@Param('fieldId') fieldId: string) {
    return this.fieldService.findFarmByFieldId(fieldId);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldService.update(id, updateFieldDto);
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for field with id :${id}`);
    return this.fieldService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for field with id:${id}`);
    return this.fieldService.removeSoft(id);
  }
}
