import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Crop } from './entities/crop.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropService {
  constructor(@InjectRepository(Crop) private repo: Repository<Crop>) {}

  async create(name: string) {
    const cropCheck = await this.repo.findOne({ where: { name } });
    if (cropCheck) {
      throw new BadRequestException('Crop name already exists');
    }
    const crop = this.repo.create({ name });

    return this.repo.save(crop);
  }

  async findOne(id: string) {
    return this.repo
      .createQueryBuilder('crop')
      .where('crop.id = :id', { id })
      .getOne();
  }

  findAll(name: string) {
    return this.repo.find({ where: { name } });
  }
  async findCropsByFieldId(fieldId: string): Promise<Crop[]> {
    const queryBuilder = this.repo.createQueryBuilder('crop');

    queryBuilder
      .innerJoin('growing_period', 'gp', 'gp.cropId = crop.id')
      .where('gp.fieldId = :fieldId', { fieldId });

    const crops = await queryBuilder.getMany();

    if (!crops || crops.length === 0) {
      throw new NotFoundException('No crops found for the specified field');
    }

    return crops;
  }
  async update(id: string, updateCropDto: UpdateCropDto) {
    const crop = await this.findOne(id);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }
    Object.assign(crop, updateCropDto);
    return this.repo.save(crop);
  }

  async removePermanent(id: string) {
    const crop = await this.findOne(id);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    await this.repo.remove(crop);
    return {
      success: true,
      message: `Permanent delete crop successful with id ${id}`,
    };
  }

  async removeSoft(id: string) {
    const crop = await this.findOne(id);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    await this.repo.softRemove(crop);
    return {
      success: true,
      message: `Soft delete  crop successful with id ${id}`,
    };
  }
}
