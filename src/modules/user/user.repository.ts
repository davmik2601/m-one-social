import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { BaseRepository } from '@Database/base.repository';
import { PG_POOL } from '@Database/database.constants';
import { User } from '@Modules/user/types/user.model';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected readonly tableName = 'users';

  constructor(@Inject(PG_POOL) pool: Pool) {
    super(pool);
  }
}
