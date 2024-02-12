import { Test, TestingModule } from '@nestjs/testing';
import { FieldProcessService } from './field-process.service';

describe('FieldProcessService', () => {
  let service: FieldProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldProcessService],
    }).compile();

    service = module.get<FieldProcessService>(FieldProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
