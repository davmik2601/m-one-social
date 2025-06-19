import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ReqUserType } from '@Common/types/req-user.type';
import { SuccessType } from '@Common/types/success.type';
import { AuthUser } from '@Decorators/auth-user.decorator';
import { GetFriendsDto } from '@Modules/friend/dto/get-friends.dto';
import { FriendService } from '@Modules/friend/friend.service';
import { FriendListType } from '@Modules/friend/types/friend-list.type';

@ApiTags('Friends')
@ApiBearerAuth()
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get friends' })
  @ApiResponse({ type: FriendListType })
  async getFriends(
    @AuthUser() user: ReqUserType,
    @Query() qData: GetFriendsDto,
  ): Promise<FriendListType> {
    return this.friendService.getFriends(user, qData);
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete friend' })
  @ApiResponse({ type: SuccessType })
  async deleteFriend(
    @AuthUser() user: ReqUserType,
    @Param('userId') userId: number,
  ): Promise<SuccessType> {
    return this.friendService.deleteFriend(user, userId);
  }
}
