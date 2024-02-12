import { Injectable } from '@nestjs/common';
import { ProcessType } from './entities/process-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProcessTypeService {
  constructor(
    @InjectRepository(ProcessType) private repo: Repository<ProcessType>,
  ) {}

  async create(type: string) {
    const processTypeCheck = await this.repo.findOne({ where: { type } });
    if (processTypeCheck) {
      throw new BadRequestException('Process Type  already exists');
    }
    const processType = this.repo.create({ type });

    return this.repo.save(processType);
  }

  findAll(type: string) {
    return this.repo.find({ where: { type } });
  }

  // async findOne(id: string) {
  //   const processType = await this.repo.findOne({ where: { id } });
  //   if (!processType) {
  //     throw new NotFoundException('Process type not found');
  //   }

  //   return processType;
  // }

  async findOne(id: string) {
    return this.repo
      .createQueryBuilder('process_type')
      .where('process_type.id = :id', { id })
      .getOne();
  }


  async update(id: string, attrs: Partial<ProcessType>) {
    const processType = await this.findOne(id);

    if (!processType) {
      throw new NotFoundException('Process type not found');
    }
    Object.assign(processType, attrs);
    return this.repo.save(processType);
  }

  async removePermanent(id: string) {
    const processType = await this.findOne(id);

    if (!processType) {
      throw new NotFoundException('Process type not found');
    }

    await this.repo.remove(processType);
    return {
      success: true,
      message: `Permanent delete process type successful with id: ${id}`,
    };
  }

  async removeSoft(id: string) {
    const processType = await this.findOne(id);

    if (!processType) {
      throw new NotFoundException('processType not found');
    }

    await this.repo.softRemove(processType);
    return {
      success: true,
      message: `Soft delete  processType successful with id ${id}`,
    };
  }
}
