import { Injectable } from '@nestjs/common';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';
import { FarmService } from 'src/farm/farm.service';
import { SoilService } from 'src/soil/soil.service';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepo: Repository<Field>,
    private readonly farmService: FarmService,
    private readonly soilService: SoilService,
  ) {}

  async create(
    name: string,
    shape: object,
    fieldArea: number,
    farmId: string,
    soilId: string,
  ) {
    const fieldNameCheck = await this.fieldRepo.findOne({
      where: { name },
    });
    if (fieldNameCheck) {
      throw new BadRequestException('Field with this name already exists');
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
    const validShapeTypes = ['Polygon', 'Multypolygon'];

    if (!shape || !shape['type'] || !validShapeTypes.includes(shape['type'])) {
      throw new BadRequestException(
        'The provided shape is not correct (it should be of type Polygon or Multypolygon)',
      );
    }
    let soil;
    if (soilId) {
      soil = await this.soilService.findOne(soilId);

      if (!soil.id) {
        throw new NotFoundException(`Soil with ID ${soil.Id} not found`);
      }
    }

    const field = this.fieldRepo.create({ name, shape, fieldArea });
    if (soil.id) {
      field.soilId = soil.id;
    }
    field.farmId = farm.id;
    return this.fieldRepo.save(field);
  }

  findAll(name: string) {
    return this.fieldRepo.find({ where: { name } });
  }

  async findOne(id: string) {
    return this.fieldRepo
      .createQueryBuilder('field')
      .where('field.id = :id', { id })
      .getOne();
  }

  async findFieldsByFarmId(farmId: string) {
    return this.fieldRepo.find({
      where: { farmId },
    });
  }

  async findFarmByFieldId(fieldId: string) {
    const field = await this.fieldRepo
      .createQueryBuilder('field')
      .where('field.id = :fieldId', { fieldId })
      .getOne();

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    if (field.farmId) {
      const farm = await this.farmService.findOne(field.farmId);

      if (!farm) {
        throw new NotFoundException('Farm not found');
      }

      return farm;
    }

    throw new NotFoundException('Farm ID not provided for the field');
  }
  async checkIfFieldNameExists(name: string, excludeFieldId?: string) {
    const queryBuilder = this.fieldRepo
      .createQueryBuilder('field')
      .where('field.name = :name', { name });

    if (excludeFieldId) {
      queryBuilder.andWhere('field.id != :excludeFieldId', { excludeFieldId });
    }

    const existingField = await queryBuilder.getOne();

    if (existingField) {
      throw new BadRequestException('Field with the same name already exists.');
    }
  }
  async update(id: string, updateFieldDto: UpdateFieldDto) {
    if (updateFieldDto.name) {
      await this.checkIfFieldNameExists(updateFieldDto.name, id);
    }

    const field = await this.findOne(id);

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    if (updateFieldDto.shape.type !== ('Polygon' || 'Multypolygon')) {
      throw new BadRequestException(
        'The provided shape is not correct (if should be of type Polygon or Multypolygon',
      );
    }
    const farm = await this.farmService.findOne(updateFieldDto.farmId);
    if (!farm) {
      throw new BadRequestException('Farm with the provided farmId not found');
    }

    Object.assign(field, updateFieldDto);

    return this.fieldRepo.save(field);
  }

  async removePermanent(id: string) {
    const field = await this.findOne(id);

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    await this.fieldRepo.remove(field);
    return {
      success: true,
      message: `Permanent delete field successful with id ${id}`,
    };
  }

  async removeSoft(id: string) {
    const field = await this.findOne(id);

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    await this.fieldRepo.softRemove(field);
    return {
      success: true,
      message: `Soft delete field successful with id ${id}`,
    };
  }

  async mostCommonSoilTypePerFarm() {
    const result = await this.fieldRepo
      .createQueryBuilder('field')
      .innerJoin('soil', 'soil', 'field.soil_id = soil.id')
      .innerJoin('farm', 'farm', 'field.farm_id = farm.id')
      .groupBy('farm.id')
      .addGroupBy('soil.type')
      .select([
        'farm.name AS "farmName"',
        'soil.type AS "soilType"',
        'COUNT(field.id) AS "soilTypeCount"',
      ])
      .orderBy('"soilTypeCount"', 'DESC')
      .getRawMany();

    return result;
  }
}
