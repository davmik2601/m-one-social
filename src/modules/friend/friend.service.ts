import { Injectable, NotFoundException } from '@nestjs/common';

import { ReqUserType } from '@Common/types/req-user.type';
import { SuccessType } from '@Common/types/success.type';
import { FindAllOptions } from '@Database/types/find-options.interface';
import { CreateFriendDto } from '@Modules/friend/dto/create-friend.dto';
import { GetFriendsDto } from '@Modules/friend/dto/get-friends.dto';
import { FriendRepository } from '@Modules/friend/repositories/friend.repository';
import { Friend } from '@Modules/friend/types/friend.model';
import { FriendType } from '@Modules/friend/types/friend.type';
import { FriendListType } from '@Modules/friend/types/friend-list.type';

@Injectable()
export class FriendService {
  constructor(private readonly friendRepository: FriendRepository) {}

  async create(data: CreateFriendDto): Promise<FriendType> {
    return this.friendRepository.create(data);
  }

  async findAll(options: FindAllOptions<Friend>): Promise<FriendType[]> {
    return this.friendRepository.findAll(options);
  }

  async getFriends(
    user: ReqUserType,
    qData: GetFriendsDto,
  ): Promise<FriendListType> {
    return this.friendRepository.getFriends(user.id, qData);
  }

  async deleteFriend(user: ReqUserType, userId: number): Promise<SuccessType> {
    const friend = await this.friendRepository.findOne({
      where: {
        $or: [
          { userId1: user.id, userId2: userId },
          { userId1: userId, userId2: user.id },
        ],
      },
      select: ['id'],
    });

    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    await this.friendRepository.delete(friend.id);

    return { success: true };
  }
}
