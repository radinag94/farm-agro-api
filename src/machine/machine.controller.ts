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
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { TransferMachineDto } from './dto/transfer-machine.dto';
import { UserRole } from 'src/user/user-role.enum';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Query } from '@nestjs/common';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/create')
  async create(@Body() createMachineDto: CreateMachineDto) {
    try {
      const createdMachine = await this.machineService.create(
        createMachineDto.name,
        createMachineDto.brand,
        createMachineDto.registerNumber,
        createMachineDto.farmId,
      );
      return { createdMachine };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get()
  findAll(@Query('name') name: string) {
    return this.machineService.findAll(name);
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.machineService.findOne(id);
  }

  @Get('/byFarmId/:farmId')
  findMachinesByFarmId(@Param('farmId') farmId: string) {
    return this.machineService.findMachinesByFarmId(farmId);
  }

  @Get('/byMachineId/:machineId')
  findFarmsByMachineId(@Param('machineId') machineId: string) {
    return this.machineService.findFarmByMachineId(machineId);
  }
  @Get('/byFieldId/:fieldId')
  findMachinesByFieldId(@Param('fieldId') fieldId: string) {
    return this.machineService.findMachinesByFieldId(fieldId);
  }
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    return this.machineService.update(id, updateMachineDto);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id/transfer')
  async transferMachine(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() transferMachineDto: TransferMachineDto,
  ) {
    return this.machineService.transferMachine(id, transferMachineDto);
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for machine with id :${id}`);
    return this.machineService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for machine with id:${id}`);
    return this.machineService.removeSoft(id);
  }
}
