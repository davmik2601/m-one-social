import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { BaseRepository } from '@Database/base.repository';
import { PG_POOL } from '@Database/database.constants';
import { FindAllOptions } from '@Database/types/find-options.interface';
import { FriendRequestStatusEnum } from '@Modules/friend-request/enums/friend-request-status.enum';
import { FriendRequest } from '@Modules/friend-request/types/friend-request.model';
import { FriendRequestListType } from '@Modules/friend-request/types/friend-request-list.type';

@Injectable()
export class FriendRequestRepository extends BaseRepository<FriendRequest> {
  protected readonly tableName = 'friend_requests';

  constructor(@Inject(PG_POOL) pool: Pool) {
    super(pool);
  }

  async getFriendRequestsByReceiverId(
    receiverId: number,
    {
      skip = 0,
      take = 10,
      status = FriendRequestStatusEnum.PENDING,
    }: Pick<FindAllOptions<FriendRequest>, 'skip' | 'take'> & {
      status?: FriendRequestStatusEnum;
    },
  ): Promise<FriendRequestListType> {
    const params: any[] = [receiverId];

    let query = `
        SELECT fr.*, u."firstName", u."lastName"
        FROM ${this.tableName} fr
                 JOIN users u ON fr."senderId" = u.id
        WHERE fr."receiverId" = $1
    `;

    params.push(status);
    query += ` AND fr."status" = $${params.length}`;

    query += ` ORDER BY fr."createdAt" DESC`;

    params.push(take);
    query += ` LIMIT $${params.length}`;

    params.push(skip);
    query += ` OFFSET $${params.length}`;

    const [result, total] = await Promise.all([
      this.pool.query(query, params),
      this.count({ receiverId, status }),
    ]);

    return {
      friendRequests: result.rows.map((row) => ({
        id: row.id,
        senderId: row.senderId,
        receiverId: row.receiverId,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        user: {
          id: row.senderId,
          firstName: row.firstName,
          lastName: row.lastName,
        },
      })),
      total,
    };
  }
}
