import { ApiProperty } from '@nestjs/swagger';

export class TemplateUrlDTO {
  @ApiProperty()
  url: string;
}
