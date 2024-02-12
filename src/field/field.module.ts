import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { Field } from './entities/field.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmModule } from 'src/farm/farm.module';
import { SoilModule } from 'src/soil/soil.module';

@Module({
  imports: [FarmModule, SoilModule, TypeOrmModule.forFeature([Field])],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService, TypeOrmModule.forFeature([Field])],
})
export class FieldModule {}
