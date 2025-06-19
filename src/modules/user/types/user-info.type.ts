import { ApiProperty } from '@nestjs/swagger';

export class UserInfoType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  age: number;
}
