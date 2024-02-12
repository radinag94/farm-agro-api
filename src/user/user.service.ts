import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }

    const user = await this.createQueryBuilder()
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private createQueryBuilder(): SelectQueryBuilder<User> {
    return this.repo.createQueryBuilder('user');
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async removePermanent(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    await this.repo.remove(user);
    return { success: true, message: 'Permanent delete successful' };
  }

  async removeSoft(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Soil not found');
    }

    await this.repo.softRemove(user);
    return { success: true, message: 'Soft delete successful' };
  }
}
