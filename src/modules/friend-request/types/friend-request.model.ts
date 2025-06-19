import { FriendRequestStatusEnum } from '@Modules/friend-request/enums/friend-request-status.enum';

export class FriendRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  senderId: number;
  receiverId: number;
  status: FriendRequestStatusEnum;
}
