import { ApiProperty } from '@nestjs/swagger';

import { UserType } from '@Modules/user/types/user.type';

export class UserListType {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: () => [UserType] })
  users: UserType[];
}
