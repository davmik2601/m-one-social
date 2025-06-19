import { Module } from '@nestjs/common';

import { FriendRepository } from '@Modules/friend/repositories/friend.repository';

import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  controllers: [FriendController],
  providers: [FriendRepository, FriendService],
  exports: [FriendService],
})
export class FriendModule {}
