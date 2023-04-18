import { Test, TestingModule } from '@nestjs/testing';
import { TitulosAvencerController } from './titulos-avencer.controller';

describe('TitulosAvencerController', () => {
  let controller: TitulosAvencerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitulosAvencerController],
    }).compile();

    controller = module.get<TitulosAvencerController>(TitulosAvencerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
