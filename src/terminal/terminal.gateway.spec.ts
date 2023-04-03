import { Test, TestingModule } from '@nestjs/testing';
import { TerminalGateway } from './terminal.gateway';

describe('TerminalGateway', () => {
  let gateway: TerminalGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerminalGateway],
    }).compile();

    gateway = module.get<TerminalGateway>(TerminalGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
