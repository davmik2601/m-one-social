import { ApiProperty } from '@nestjs/swagger';

import { UserInfoType } from '@Modules/user/types/user-info.type';

export class UserListType {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: () => [UserInfoType] })
  users: UserInfoType[];
}
