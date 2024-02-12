import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';
import { Repository } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class FarmService {
  constructor(@InjectRepository(Farm) private repo: Repository<Farm>) {}

  async create(createFarmDto: CreateFarmDto) {
    await this.checkIfFarmNameExists(createFarmDto.name);
    const existingFarm = await this.repo.findOne({
      where: {
        location: {
          type: 'Point',
          coordinates: [createFarmDto.latitude, createFarmDto.longitude],
        },
      },
    });

    if (existingFarm) {
      throw new BadRequestException(
        'Farm with the same location already exists.',
      );
    }

    const farm = this.repo.create({
      name: createFarmDto.name,
      location: {
        type: 'Point',
        coordinates: [createFarmDto.latitude, createFarmDto.longitude],
      },
    });

    return this.repo.save(farm);
  }

  async checkIfFarmNameExists(name: string, excludeFarmId?: string) {
    const queryBuilder = this.repo
      .createQueryBuilder('farm')
      .where('farm.name = :name', { name });

    if (excludeFarmId) {
      queryBuilder.andWhere('farm.id != :excludeFarmId', { excludeFarmId });
    }

    const existingFarm = await queryBuilder.getOne();

    if (existingFarm) {
      throw new BadRequestException('Farm with the same name already exists.');
    }
  }

  findAll(name: string) {
    return this.repo.find({ where: { name } });
  }

  // async findOne(id: string) {
  //   const farm = await this.repo.findOne({ where: { id } });

  //   if (!farm) {
  //     throw new NotFoundException('Farm not found');
  //   }

  //   return farm;
  // }

  async findOne(id: string) {
    return this.repo
      .createQueryBuilder('farm')
      .where('farm.id = :id', { id })
      .getOne();
  }

  async update(id: string, updateFarmDto: UpdateFarmDto) {
    if (updateFarmDto.name) {
      await this.checkIfFarmNameExists(updateFarmDto.name, id);
    }

    const farm = await this.findOne(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
    if (updateFarmDto.latitude && updateFarmDto.longitude) {
      const location = {
        type: 'Point',
        coordinates: [updateFarmDto.longitude, updateFarmDto.latitude],
      };
      const farmWithSameLocation = await this.repo.findOne({
        where: {
          location,
        },
      });
      if (farmWithSameLocation && farmWithSameLocation.id !== id) {
        throw new BadRequestException(
          'Farm with the same location already exists',
        );
      }
      updateFarmDto.location = location;
    }
    Object.assign(farm, updateFarmDto);

    return this.repo.save(farm);
  }

  async removePermanent(id: string) {
    const farm = await this.findOne(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    await this.repo.remove(farm);
    return {
      success: true,
      message: `Permanent delete farm successful with id ${id}`,
    };
  }

  async removeSoft(id: string) {
    const farm = await this.findOne(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    await this.repo.softRemove(farm);
    return {
      success: true,
      message: `Soft delete  farm successful with id ${id}`,
    };
  }
  async getFarmsWithMostMachines() {
    const result = await this.repo
      .createQueryBuilder('farm')

      .innerJoin('machine', 'machine', 'machine.farmId = farm.id')
      .select([
        'farm.name AS "farmName"',
        'CAST(COUNT(DISTINCT machine.id) AS INTEGER) AS "machineCount"',
      ])
      .groupBy('farm.id')
      .orderBy('"machineCount"', 'DESC')
      .getRawMany();

    return result;
  }
}
