import { ApiProperty } from '@nestjs/swagger';

export class SuccessType {
  @ApiProperty()
  success: boolean;
}
