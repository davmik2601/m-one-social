import { ApiProperty } from '@nestjs/swagger';

import { FriendRequestStatusEnum } from '@Modules/friend-request/enums/friend-request-status.enum';

export class FriendRequestType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  senderId: number;

  @ApiProperty()
  receiverId: number;

  @ApiProperty({ enum: FriendRequestStatusEnum })
  status: FriendRequestStatusEnum;
}
