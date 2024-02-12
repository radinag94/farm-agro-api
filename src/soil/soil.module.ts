import { Module } from '@nestjs/common';
import { SoilService } from './soil.service';
import { SoilController } from './soil.controller';
import { Soil } from './entities/soil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Soil])],
  controllers: [SoilController],
  providers: [SoilService],
  exports: [SoilService],
})
export class SoilModule {}
