import { Test, TestingModule } from '@nestjs/testing';
import { ProcessTypeService } from './process-type.service';

describe('ProcessTypeService', () => {
  let service: ProcessTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessTypeService],
    }).compile();

    service = module.get<ProcessTypeService>(ProcessTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
