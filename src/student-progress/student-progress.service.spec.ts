import { Test, TestingModule } from '@nestjs/testing';
import { StudentProgressService } from './student-progress.service';

describe('StudentProgressService', () => {
  let service: StudentProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentProgressService],
    }).compile();

    service = module.get<StudentProgressService>(StudentProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
