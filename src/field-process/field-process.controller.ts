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
import { FieldProcessService } from './field-process.service';
import { CreateFieldProcessDto } from './dto/create-field-process.dto';
import { UpdateFieldProcessDto } from './dto/update-field-process.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/common';

@UseGuards(RolesGuard)
@Controller('field-process')
export class FieldProcessController {
  constructor(private readonly fieldProcessService: FieldProcessService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/create')
  async create(@Body() createFieldProcessDto: CreateFieldProcessDto) {
    try {
      const createdFieldProcess = await this.fieldProcessService.create(
        createFieldProcessDto,
      );
      return { data: createdFieldProcess };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  findAll() {
    return this.fieldProcessService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldProcessService.findOne(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFieldProcessDto: UpdateFieldProcessDto,
  ) {
    return this.fieldProcessService.update(id, updateFieldProcessDto);
  }

  @Get('/by-growing-period/:growingPeriodId')
  findFieldProcessesByGrowingPeriodId(
    @Param('growingPeriodId', ParseUUIDPipe) growingPeriodId: string,
  ) {
    return this.fieldProcessService.findFieldProcessesByGrowingPeriodId(
      growingPeriodId,
    );
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(
      `Attempting permanent removal for field process with id :${id}`,
    );
    return this.fieldProcessService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for field process with id:${id}`);
    return this.fieldProcessService.removeSoft(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete('/by-growing-period/:growingPeriodId')
  removeFieldProcessesByGrowingPeriodId(
    @Param('growingPeriodId', ParseUUIDPipe) growingPeriodId: string,
  ) {
    return this.fieldProcessService.removeFieldProcessesByGrowingPeriodId(
      growingPeriodId,
    );
  }
}
