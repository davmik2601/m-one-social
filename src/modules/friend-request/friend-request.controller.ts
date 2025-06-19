import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ReqUserType } from '@Common/types/req-user.type';
import { AuthUser } from '@Decorators/auth-user.decorator';
import { AcceptFriendRequestDto } from '@Modules/friend-request/dto/accept-friend-request.dto';
import { GetFriendRequestsDto } from '@Modules/friend-request/dto/get-friend-requests.dto';
import { SendFriendRequestParamsDto } from '@Modules/friend-request/dto/send-friend-request-params.dto';
import { FriendRequestService } from '@Modules/friend-request/friend-request.service';
import { FriendRequestType } from '@Modules/friend-request/types/friend-request.type';
import { FriendRequestListType } from '@Modules/friend-request/types/friend-request-list.type';

@ApiTags('Friend Requests')
@ApiBearerAuth()
@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendService: FriendRequestService) {}

  @Post('/')
  @ApiOperation({ summary: 'Send friend request' })
  @ApiResponse({ type: FriendRequestType })
  async sendFriendRequest(
    @AuthUser() user: ReqUserType,
    @Body() data: SendFriendRequestParamsDto,
  ): Promise<FriendRequestType> {
    return this.friendService.sendFriendRequest(user, data);
  }

  @Post('/:requestId/:status')
  @ApiOperation({ summary: 'Accept or Decline friend request' })
  @ApiResponse({ type: FriendRequestType })
  async acceptFriendRequest(
    @AuthUser() user: ReqUserType,
    @Param() pData: AcceptFriendRequestDto,
  ): Promise<FriendRequestType> {
    return this.friendService.acceptFriendRequest(
      user,
      pData.requestId,
      pData.status,
    );
  }

  @Get('/')
  @ApiOperation({ summary: 'Accept or Decline friend request' })
  @ApiResponse({ type: FriendRequestListType })
  async getFriendRequests(
    @AuthUser() user: ReqUserType,
    @Query() qData: GetFriendRequestsDto,
  ): Promise<FriendRequestListType> {
    return this.friendService.getFriendRequests(user, qData);
  }
}
