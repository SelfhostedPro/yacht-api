import { Test, TestingModule } from '@nestjs/testing';
import { ServersController } from './servers.controller';

describe('ServersController', () => {
  let controller: ServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServersController],
    }).compile();

    controller = module.get<ServersController>(ServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
