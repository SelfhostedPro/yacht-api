import { Test, TestingModule } from '@nestjs/testing';
import { TerminalService } from './terminal.service';

describe('TerminalService', () => {
  let service: TerminalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerminalService],
    }).compile();

    service = module.get<TerminalService>(TerminalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
