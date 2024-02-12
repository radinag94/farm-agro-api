import { Injectable } from '@nestjs/common';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { FarmService } from 'src/farm/farm.service';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FieldService } from 'src/field/field.service';
import { TransferMachineDto } from './dto/transfer-machine.dto';
import { FieldProcess } from 'src/field-process/entities/field-process.entity';
import { FieldProcessService } from 'src/field-process/field-process.service';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
    private readonly farmService: FarmService,
    private readonly fieldProcessService: FieldProcessService,
  ) {}

  async create(
    name: string,
    brand: string,
    registerNumber: string,
    farmId: string,
  ) {
    const registerNumberCheck = await this.machineRepo.findOne({
      where: { registerNumber },
    });
    if (registerNumberCheck) {
      throw new BadRequestException('Machine with this number already exists');
    }

    let farm;
    if (farmId) {
      farm = await this.farmService.findOne(farmId);
      if (!farm) {
        throw new BadRequestException(
          'Farm with the provided farmId not found',
        );
      }
    }

    const newMachine = this.machineRepo.create({ name, brand, registerNumber });
    newMachine.farmId = farm.id;
    return this.machineRepo.save(newMachine);
  }

  findAll(name: string) {
    return this.machineRepo.find({ where: { name } });
  }

  // findAll(name: string) {
  //   return this.fieldRepo.find({ where: { name } });
  // }

  // findOne(id: string, options?: { relations?: string[] }) {
  //   if (!id) {
  //     return null;
  //   }
  //   return this.machineRepo.findOne({
  //     where: { id },
  //     relations: options?.relations,
  //   });
  // }

  async findOne(id: string) {
    return this.machineRepo
      .createQueryBuilder('machine')
      .where('machine.id = :id', { id })
      .getOne();
  }

  async findMachinesByFarmId(farmId: string) {
    return this.machineRepo.find({
      where: { farmId },
    });
  }

  async findFarmByMachineId(machineId: string) {
    const machine = await this.machineRepo
      .createQueryBuilder('machine')
      .where('machine.id = :machineId', { machineId })
      .getOne();

    if (!machine) {
      throw new NotFoundException('Mahine not found');
    }

    if (machine.farmId) {
      const farm = await this.farmService.findOne(machine.farmId);

      if (!farm) {
        throw new NotFoundException('Farm not found');
      }

      return farm;
    }
  }
  async findMachinesByFieldId(fieldId: string): Promise<Machine[]> {
    const machines = await this.machineRepo
      .createQueryBuilder('machine')
      .innerJoin('farm', 'farm', 'farm.id = machine.farmId')
      .innerJoin('field', 'field', 'field.farmId = farm.id')
      .where('field.id = :fieldId', { fieldId })
      .getMany();

    return machines;
  }
  async checkIfMachineRegisterNumberExists(
    registerNumber: string,
    excludeMachineId?: string,
  ) {
    const queryBuilder = this.machineRepo
      .createQueryBuilder('machine')
      .where('machine.registerNumber = :registerNumber', { registerNumber });

    if (excludeMachineId) {
      queryBuilder.andWhere('machine.id != :excludeMachineId', {
        excludeMachineId,
      });
    }

    const existingMachine = await queryBuilder.getOne();

    if (existingMachine) {
      throw new BadRequestException(
        'Machine with the same register number already exists.',
      );
    }
  }

  async update(id: string, updateMachineDto: UpdateMachineDto) {
    const machine = await this.findOne(id);

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    if (
      updateMachineDto.registerNumber &&
      updateMachineDto.registerNumber !== machine.registerNumber
    ) {
      await this.checkIfMachineRegisterNumberExists(
        updateMachineDto.registerNumber,
        id,
      );

      machine.registerNumber = updateMachineDto.registerNumber;
    }
    machine.registerNumber = updateMachineDto.registerNumber;

    Object.assign(machine, updateMachineDto);

    return this.machineRepo.save(machine);
  }

  async transferMachine(id, transferMachineDto: TransferMachineDto) {
    const { oldFarmId, newFarmId } = transferMachineDto;
    const machine = await this.findOne(id);
    const fieldProcesses =
      await this.fieldProcessService.findFieldProcessesByMachineId(id);

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    const newFarm = await this.farmService.findOne(newFarmId);
    const oldFarm = await this.farmService.findOne(oldFarmId);
    if (!newFarm || !oldFarm) {
      throw new BadRequestException(
        'Farm with the provided newFarmId ot oldFarmid not found',
      );
    }
    if (machine.farmId !== oldFarmId) {
      throw new BadRequestException(
        'This machine is not a possesion of this farm ',
      );
    }
    if (fieldProcesses && fieldProcesses.length > 0) {
      throw new BadRequestException(
        'Cannot transfer machine with associated field processes',
      );
    }

    machine.farmId = newFarm.id;

    return this.machineRepo.save(machine);
  }

  async removePermanent(id: string) {
    const machine = await this.findOne(id);
    if (!machine) {
      throw new NotFoundException('Machine not found');
    }
    const fieldProcesses =
      await this.fieldProcessService.findFieldProcessesByMachineId(id);

    if (fieldProcesses.length > 0) {
      throw new BadRequestException(
        'Cannot delete machine with associated field processes',
      );
    }

    await this.machineRepo.remove(machine);
    return {
      success: true,
      message: `Permanent delete machine successful with id ${id}`,
    };
  }

  async removeSoft(id: string) {
    const machine = await this.findOne(id);

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    await this.machineRepo.softRemove(machine);
    return {
      success: true,
      message: `Soft delete  machine successful with id ${id}`,
    };
  }
}
