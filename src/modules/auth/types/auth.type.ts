import { ApiProperty } from '@nestjs/swagger';

export class AuthType {
  @ApiProperty()
  accessToken: string;
}
