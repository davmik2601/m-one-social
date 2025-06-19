import { ApiProperty } from '@nestjs/swagger';

import { UserInfoType } from '@Modules/user/types/user-info.type';

export class GetFriendType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserInfoType })
  user: UserInfoType;
}
