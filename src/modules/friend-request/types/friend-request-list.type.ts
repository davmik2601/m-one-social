import { ApiProperty } from '@nestjs/swagger';

import { FriendRequestType } from '@Modules/friend-request/types/friend-request.type';

export class FriendRequestListType {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: () => [FriendRequestType] })
  friendRequests: FriendRequestType[];
}
