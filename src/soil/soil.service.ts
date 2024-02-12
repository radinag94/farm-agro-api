import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Soil } from './entities/soil.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SoilService {
  constructor(@InjectRepository(Soil) private repo: Repository<Soil>) {}

  async create(type: string) {
    const soilCheck = await this.repo.findOne({ where: { type } });
    if (soilCheck) {
      throw new BadRequestException('Soil type already exists');
    }
    const soil = this.repo.create({ type });
   
    return this.repo.save(soil);
  }

  findAll(type: string) {
    return this.repo.find({ where: { type } });
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, attrs: Partial<Soil>) {
    const soil = await this.findOne(id);

    if (!soil) {
      throw new NotFoundException('Soil not found');
    }
    Object.assign(soil, attrs);
    return this.repo.save(soil);
  }

  async removePermanent(id: string) {
    const soil = await this.findOne(id);

    if (!soil) {
      throw new NotFoundException('soil not found');
    }

    await this.repo.remove(soil);
    return {
      success: true,
      message: `Permanent delete soil successful with id: ${id}`,
    };
  }

  async removeSoft(id: string) {
    const soil = await this.findOne(id);

    if (!soil) {
      throw new NotFoundException('soil not found');
    }

    await this.repo.softRemove(soil);
    return {
      success: true,
      message: `Soft delete  soil successful with id ${id}`,
    };
  }
}
