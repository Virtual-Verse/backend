import { Test, TestingModule } from '@nestjs/testing';
import { StudentProgressController } from './student-progress.controller';

describe('StudentProgressController', () => {
  let controller: StudentProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentProgressController],
    }).compile();

    controller = module.get<StudentProgressController>(StudentProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
