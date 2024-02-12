import { Inject, Injectable } from '@nestjs/common';
import { CreateFieldProcessDto } from './dto/create-field-process.dto';
import { UpdateFieldProcessDto } from './dto/update-field-process.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldProcess } from './entities/field-process.entity';
import { MachineService } from 'src/machine/machine.service';
import { ProcessTypeService } from 'src/process-type/process-type.service';
import { GrowingPeriodService } from 'src/growing-period/growing-period.service';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { GrowingPeriod } from 'src/growing-period/entities/growing-period.entity';
import { Machine } from 'src/machine/entities/machine.entity';
import { ProcessType } from 'src/process-type/entities/process-type.entity';
import { Field } from 'src/field/entities/field.entity';

@Injectable()
export class FieldProcessService {
  constructor(
    @InjectRepository(FieldProcess)
    private readonly fieldProcessRepo: Repository<FieldProcess>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  async create(createFieldProcessDto: CreateFieldProcessDto) {
    const { pDate, machineId, processTypeId, growingPeriodId } =
      createFieldProcessDto;

    const result = await this.entityManager
      .getRepository(ProcessType)
      .createQueryBuilder('processType')

      .select('processType.id', 'processTypeId')
      .where('processType.id = :processTypeId', { processTypeId })
      .getRawOne();

    if (!result) {
      throw new NotFoundException('ProcessType not found');
    }
    const growingPeriodFarmId = await this.entityManager
      .getRepository(GrowingPeriod)
      .createQueryBuilder('growing_period')
      .innerJoin(Field, 'field', 'field.id = growing_period.fieldId')
      .where('growing_period.id = :growingPeriodId', { growingPeriodId })
      .select('field.farmId', 'farmId')
      .getRawOne();

    const machineFarmId = await this.entityManager
      .getRepository(Machine)
      .createQueryBuilder('machine')
      .where('machine.id = :machineId', { machineId })
      .select('machine.farmId', 'farmId')
      .getRawOne();

    if (machineFarmId.farmId !== growingPeriodFarmId.farmId) {
      throw new BadRequestException(
        `Machine with ${machineId} does not belong to the specified farm`,
      );
    }
    const fieldProcess = this.fieldProcessRepo.create({
      pDate,
      machineId,
      growingPeriodId,
      processTypeId,
    });
    return this.fieldProcessRepo.save(fieldProcess);
  }

  findAll() {
    return this.fieldProcessRepo.find();
  }

  async findOne(id: string) {
    return this.fieldProcessRepo
      .createQueryBuilder('field_process')
      .where('field_process.id = :id', { id })
      .getOne();
  }

  async update(id: string, updateFieldProcessDto: UpdateFieldProcessDto) {
    const fieldProcess = await this.findOne(id);

    if (!fieldProcess) {
      throw new NotFoundException('Field Process not found');
    }

    Object.assign(fieldProcess, updateFieldProcessDto);

    return this.fieldProcessRepo.save(fieldProcess);
  }

  async findFieldProcessesByGrowingPeriodId(growingPeriodId: string) {
    return this.fieldProcessRepo.find({
      where: { growingPeriodId },
    });
  }
  async removeFieldProcessesByGrowingPeriodId(growingPeriodId: string) {
    const fieldProcesses = await this.fieldProcessRepo.find({
      where: { growingPeriodId },
    });
    return this.fieldProcessRepo.softRemove(fieldProcesses);
  }

  async removePermanent(id: string) {
    const fieldProcess = await this.findOne(id);

    if (!fieldProcess) {
      throw new NotFoundException('Field process not found');
    }

    await this.fieldProcessRepo.remove(fieldProcess);
    return {
      success: true,
      message: `Permanent delete field process successful with id ${id}`,
    };
  }

  async removeSoft(id: string) {
    const fieldProcess = await this.findOne(id);

    if (!fieldProcess) {
      throw new NotFoundException('field process not found');
    }

    await this.fieldProcessRepo.softRemove(fieldProcess);
    return {
      success: true,
      message: `Soft delete  field process successful with id ${id}`,
    };
  }

  async findFieldProcessesByMachineId(machineId: string) {
    return this.entityManager.find(FieldProcess, {
      where: { machineId },
    });
  }
}
