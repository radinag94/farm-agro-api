import { GrowingPeriodService } from 'src/growing-period/growing-period.service';
import { FieldService } from 'src/field/field.service';
import { Controller, Get } from '@nestjs/common';
import { FarmService } from 'src/farm/farm.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly farmService: FarmService,
    private readonly fieldService: FieldService,
    private readonly growingPeriodService: GrowingPeriodService,
  ) {}

  @Get('count-of-fields-perfarmandcrops')
  async getCountOfFieldsPerFarmAndCrop() {
    const report = await this.growingPeriodService.countFieldsPerFarmAndCrop();
    return { report };
  }

  @Get('farms-with-most-machines')
  async getFarmWithTheMostMachine() {
    const report = await this.farmService.getFarmsWithMostMachines();
    return { report };
  }

  @Get('most-common-soiltype')
  async getMostCommonSoil() {
    const report = await this.fieldService.mostCommonSoilTypePerFarm();
    return { report };
  }
}
