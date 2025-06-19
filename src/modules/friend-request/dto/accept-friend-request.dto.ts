import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';

import { FriendRequestStatusEnum } from '@Modules/friend-request/enums/friend-request-status.enum';

export class AcceptFriendRequestDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  requestId: number;

  @IsNotEmpty()
  @IsIn([FriendRequestStatusEnum.ACCEPTED, FriendRequestStatusEnum.DECLINED])
  @ApiProperty({
    enum: [FriendRequestStatusEnum.ACCEPTED, FriendRequestStatusEnum.DECLINED],
  })
  status: FriendRequestStatusEnum;
}
