import { ApiProperty } from '@nestjs/swagger';

import { GetFriendType } from '@Modules/friend/types/get-friend.type';

export class FriendListType {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: () => [GetFriendType] })
  friends: GetFriendType[];
}
