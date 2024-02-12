import { Injectable } from '@nestjs/common';
import { UpdateGrowingPeriodDto } from './dto/update-growing-period.dto';
import { GrowingPeriod } from './entities/growing-period.entity';
import { CropService } from 'src/crop/crop.service';
import { FieldService } from 'src/field/field.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { MachineService } from 'src/machine/machine.service';
import { ProcessTypeService } from 'src/process-type/process-type.service';
import { FieldProcessService } from 'src/field-process/field-process.service';

@Injectable()
export class GrowingPeriodService {
  constructor(
    @InjectRepository(GrowingPeriod)
    private growingPeriodRepo: Repository<GrowingPeriod>,
    private readonly cropService: CropService,
    private readonly fieldService: FieldService,
    private readonly machineService: MachineService,
    private readonly processTypeService: ProcessTypeService,
    private readonly fieldProcessService: FieldProcessService,
  ) {}

  async create(
    cropId: string,
    fieldId: string,
    processTypeId: string,
    selectedMachineId: string,
  ) {
    const field = await this.fieldService.findOne(fieldId);
    if (!field) {
      throw new BadRequestException(
        'Field with the provided field id not found',
      );
    }

    const crop = await this.cropService.findOne(cropId);
    if (!crop) {
      throw new BadRequestException('Crop with the provided crop id not found');
    }
    const machines = await this.machineService.findMachinesByFieldId(fieldId);
    const machineIsValid = machines.some(
      (machine) => machine.id === selectedMachineId,
    );
    if (!machineIsValid) {
      throw new BadRequestException(
        'The selected machine is not valid for the specified field',
      );
    }
    const processType = await this.processTypeService.findOne(processTypeId);
    if (!processType) {
      throw new NotFoundException('ProcessType not found');
    }

    const growingPeriod = this.growingPeriodRepo.create({
      cropId: crop.id,
      fieldId: field.id,
    });
    await this.growingPeriodRepo.save(growingPeriod);

    await this.fieldProcessService.create({
      pDate: new Date(),
      machineId: selectedMachineId,
      processTypeId: processType.id,
      growingPeriodId: growingPeriod.id,
    });

    return growingPeriod;
  }

  findAll() {
    return this.growingPeriodRepo.find();
  }

  async findOne(id: string) {
    return this.growingPeriodRepo
      .createQueryBuilder('growing_period')
      .where('growing_period.id = :id', { id })
      .getOne();
  }

  async findGrowingPeriodsByFieldId(fieldId: string): Promise<GrowingPeriod[]> {
    const growingPeriods = await this.growingPeriodRepo
      .createQueryBuilder('growing_period')
      .where('growing_period.fieldId = :fieldId', { fieldId })
      .getMany();

    // if (!growingPeriods || growingPeriods.length === 0) {
    //   throw new NotFoundException(
    //     'No growing periods found for the specified field',
    //   );
    // }

    return growingPeriods;
  }

  async update(id: string, updateGrowingPeriodDto: UpdateGrowingPeriodDto) {
    const growingPeriod = await this.findOne(id);

    if (!growingPeriod) {
      throw new NotFoundException('Growing period not found');
    }

    Object.assign(growingPeriod, updateGrowingPeriodDto);

    return this.growingPeriodRepo.save(growingPeriod);
  }

  async removePermanent(id: string) {
    const growingPeriod = await this.findOne(id);

    if (!growingPeriod) {
      throw new NotFoundException('Growing Period not found');
    }

    await this.growingPeriodRepo.remove(growingPeriod);
    return {
      success: true,
      message: `Permanent delete growing period successful with id ${id}`,
    };
  }

  async removeSoft(id: string) {
    const growingPeriod = await this.findOne(id);

    if (!growingPeriod) {
      throw new NotFoundException('growingPeriod not found');
    }

    await this.growingPeriodRepo.softRemove(growingPeriod);
    return {
      success: true,
      message: `Soft delete  growingPeriod successful with id ${id}`,
    };
  }

  async countFieldsPerFarmAndCrop() {
    const result = await this.growingPeriodRepo
      .createQueryBuilder('growingPeriod')
      .innerJoin('field', 'field', 'growingPeriod.fieldId = field.id')
      .innerJoin('farm', 'farm', 'field.farmId = farm.id')
      .innerJoin('crop', 'crop', 'growingPeriod.cropId = crop.id')
      .groupBy('farm.id, crop.name')
      .select([
        'farm.name as farmName',
        'crop.name as cropName',
        'CAST(COUNT(field.id) AS INTEGER) as fieldCount',
      ])
      .orderBy('crop.name')
      .getRawMany();

    return result;
  }
}
