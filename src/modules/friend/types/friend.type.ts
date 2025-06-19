import { ApiProperty } from '@nestjs/swagger';

export class FriendType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId1: number;

  @ApiProperty()
  userId2: number;
}
