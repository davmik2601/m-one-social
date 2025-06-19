import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PaginationDto } from '@Common/dto/pagination.dto';
import { FriendRequestStatusEnum } from '@Modules/friend-request/enums/friend-request-status.enum';

export class GetFriendRequestsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(FriendRequestStatusEnum)
  @ApiPropertyOptional({ enum: FriendRequestStatusEnum })
  status: FriendRequestStatusEnum;
}
