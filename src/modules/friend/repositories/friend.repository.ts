import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { BaseRepository } from '@Database/base.repository';
import { PG_POOL } from '@Database/database.constants';
import { FindAllOptions } from '@Database/types/find-options.interface';
import { Friend } from '@Modules/friend/types/friend.model';
import { FriendListType } from '@Modules/friend/types/friend-list.type';
import { FriendRequest } from '@Modules/friend-request/types/friend-request.model';

@Injectable()
export class FriendRepository extends BaseRepository<Friend> {
  protected readonly tableName = 'friends';

  constructor(@Inject(PG_POOL) pool: Pool) {
    super(pool);
  }

  async getFriends(
    userId: number,
    {
      skip = 0,
      take = 10,
    }: Pick<FindAllOptions<FriendRequest>, 'skip' | 'take'>,
  ): Promise<FriendListType> {
    const params: any[] = [userId];

    let query = `
    SELECT f.*, u.id AS "userId", u."firstName", u."lastName", u.age
    FROM ${this.tableName} f
    JOIN users u ON u.id = CASE
      WHEN f."userId1" = $1 THEN f."userId2"
      ELSE f."userId1"
    END
    WHERE f."userId1" = $1 OR f."userId2" = $1
  `;

    query += ` ORDER BY f."createdAt" DESC`;

    params.push(take);
    query += ` LIMIT $${params.length}`;

    params.push(skip);
    query += ` OFFSET $${params.length}`;

    const [result, totalResult] = await Promise.all([
      this.pool.query(query, params),
      this.pool.query(
        `SELECT COUNT(*) FROM ${this.tableName} WHERE "userId1" = $1 OR "userId2" = $1`,
        [userId],
      ),
    ]);

    const total = Number(totalResult.rows[0].count);

    return {
      friends: result.rows.map((row) => ({
        id: row.id,
        createdAt: row.createdAt,
        user: {
          id: row.userId,
          firstName: row.firstName,
          lastName: row.lastName,
          age: row.age,
        },
      })),
      total,
    };
  }
}
