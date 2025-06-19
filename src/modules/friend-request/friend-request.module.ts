import { Module } from '@nestjs/common';

import { FriendModule } from '@Modules/friend/friend.module';
import { FriendRequestRepository } from '@Modules/friend-request/repositories/friend-request.repository';
import { UserModule } from '@Modules/user/user.module';

import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';

@Module({
  imports: [UserModule, FriendModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestRepository, FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
