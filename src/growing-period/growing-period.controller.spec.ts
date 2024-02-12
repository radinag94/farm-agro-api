import { Test, TestingModule } from '@nestjs/testing';
import { GrowingPeriodController } from './growing-period.controller';
import { GrowingPeriodService } from './growing-period.service';

describe('GrowingPeriodController', () => {
  let controller: GrowingPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrowingPeriodController],
      providers: [GrowingPeriodService],
    }).compile();

    controller = module.get<GrowingPeriodController>(GrowingPeriodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
