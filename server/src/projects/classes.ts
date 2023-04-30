import { ApiProperty } from '@nestjs/swagger';

export class GitUrlDTO {
  @ApiProperty()
  url: string;
}
