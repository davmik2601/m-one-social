import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { ReqUserType } from '@Common/types/req-user.type';
import { FriendService } from '@Modules/friend/friend.service';
import { GetFriendRequestsDto } from '@Modules/friend-request/dto/get-friend-requests.dto';
import { SendFriendRequestParamsDto } from '@Modules/friend-request/dto/send-friend-request-params.dto';
import { FriendRequestStatusEnum } from '@Modules/friend-request/enums/friend-request-status.enum';
import { FriendRequestRepository } from '@Modules/friend-request/repositories/friend-request.repository';
import { FriendRequestType } from '@Modules/friend-request/types/friend-request.type';
import { FriendRequestListType } from '@Modules/friend-request/types/friend-request-list.type';
import { UserService } from '@Modules/user/user.service';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  async sendFriendRequest(
    user: ReqUserType,
    { receiverId }: SendFriendRequestParamsDto,
  ): Promise<FriendRequestType> {
    /** check if user is trying to send a request to himself */
    if (user.id === receiverId) {
      throw new BadRequestException(
        'You cannot send a friend request to yourself',
      );
    }

    /** check if receiver exists */
    const receiver = await this.userService.findOne({
      where: { id: receiverId },
      select: ['id'],
    });
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    const possibleFriends = await this.friendService.findAll({
      where: {
        $or: [
          { userId1: user.id, userId2: receiver.id },
          { userId1: receiver.id, userId2: user.id },
        ],
      },
      select: ['id'],
    });

    /** check if user is already friends with receiver */
    if (possibleFriends.length) {
      throw new ConflictException('User is already your friend');
    }

    /** get possible last friend request(s) from sender or receiver */
    const [possibleSentRequestToReceiver, possibleSentRequestToSender] =
      await Promise.all([
        this.friendRequestRepository.findOne({
          where: {
            senderId: user.id,
            receiverId: receiver.id,
          },
          select: ['id', 'status', 'senderId', 'receiverId'],
          order: { createdAt: 'DESC' },
        }),
        this.friendRequestRepository.findOne({
          where: {
            senderId: receiver.id,
            receiverId: user.id,
          },
          select: ['status'],
          order: { createdAt: 'DESC' },
        }),
      ]);

    /** check if there is a pending request from sender to receiver */
    if (
      possibleSentRequestToSender?.status === FriendRequestStatusEnum.PENDING
    ) {
      throw new NotAcceptableException(
        'This user has already sent you a friend request, please accept it',
      );
    }
    /** check if there is a pending request from receiver to sender */
    if (
      possibleSentRequestToReceiver?.status === FriendRequestStatusEnum.PENDING
    ) {
      throw new NotAcceptableException(
        'You have already sent a friend request to this user',
      );
    }

    return this.friendRequestRepository.create({
      senderId: user.id,
      receiverId: receiver.id,
      status: FriendRequestStatusEnum.PENDING,
    });
  }

  async acceptFriendRequest(
    user: ReqUserType,
    requestId: number,
    status: FriendRequestStatusEnum,
  ): Promise<FriendRequestType> {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiverId: user.id },
    });

    /** check if request exists */
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    /** check if request is already accepted or declined */
    if (request.status !== FriendRequestStatusEnum.PENDING) {
      throw new NotAcceptableException(
        'You can only accept or decline pending friend requests',
      );
    }

    Object.assign(request, { status });

    /** we are compare user id and request senderId, coz we have checker in
     * the db (see migration) for userId1 < userId2 for unique
     */
    const [userId1, userId2] =
      user.id > request.senderId
        ? [request.senderId, user.id]
        : [user.id, request.senderId];

    await Promise.all([
      this.friendRequestRepository.update({ id: requestId }, { status }),
      status === FriendRequestStatusEnum.ACCEPTED
        ? this.friendService.create({ userId1, userId2 })
        : null,
    ]);

    return request;
  }

  async getFriendRequests(
    user: ReqUserType,
    qData: GetFriendRequestsDto,
  ): Promise<FriendRequestListType> {
    return this.friendRequestRepository.getFriendRequestsByReceiverId(
      user.id,
      qData,
    );
  }
}
