import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { BaseRepository } from '@Database/base.repository';
import { PG_POOL } from '@Database/database.constants';
import { FindAllOptions } from '@Database/types/find-options.interface';
import { User } from '@Modules/user/types/user.model';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected readonly tableName = 'users';

  constructor(@Inject(PG_POOL) pool: Pool) {
    super(pool);
  }

  /** search users by firstName, lastName or age */
  /**
   *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Dear  M_ONE  Team`
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * TODO: I could also use TS_VECTOR, and do full-text search with high speed,   ! ! !
   * BUT since the test-task deadline is very short, and in the task description
   * no mention of full-text search, I will implement simple search logic here
   * with combinations with iLIKE and OR conditions.
   */
  async search(
    q: string,
    { skip, take, order, select }: Omit<FindAllOptions<User>, 'where'>,
  ): Promise<{ users: User[]; total: number }> {
    /** split query by spaces and trim each token */
    const tokens = q
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (!tokens.length) {
      /** if no normal tokens, return empty array with total count of users */

      const total = await this.count();
      return { users: [], total };
    }

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    const scoreFragments: string[] = [];

    /** for each token we will create conditions for searching by firstName, lastName or age */

    for (const token of tokens) {
      const isNumber = !isNaN(+token);

      if (isNumber) {
        /** this case when the token is a number, so we will search by age */

        conditions.push(`"age" = $${paramIndex}`);
        // if matched, we will add +1 to match score
        scoreFragments.push(
          `(CASE WHEN "age" = $${paramIndex} THEN 1 ELSE 0 END)`,
        );
        values.push(+token);
        paramIndex++;
      } else {
        /** this case when the token is a string, so we will search by firstName and lastName */

        conditions.push(`"firstName" ILIKE $${paramIndex}`);
        // if matched, we will add +1 to match score
        scoreFragments.push(
          `(CASE WHEN "firstName" ILIKE $${paramIndex} THEN 1 ELSE 0 END)`,
        );
        values.push(`%${token}%`);
        paramIndex++;

        conditions.push(`"lastName" ILIKE $${paramIndex}`);
        // if matched, we will add +1 to match score
        scoreFragments.push(
          `(CASE WHEN "lastName" ILIKE $${paramIndex} THEN 1 ELSE 0 END)`,
        );
        values.push(`%${token}%`);
        paramIndex++;
      }
    }

    /** we are saving match score fragments as how many fields matched,
     * for ordering results by match score */

    const matchScoreClause =
      scoreFragments.length > 0
        ? `(${scoreFragments.join(' + ')}) AS "match_score"`
        : '0 AS "match_score"';

    const selectedFields =
      select && select.length
        ? select.map((key) => `"${String(key)}"`).join(', ') +
          ', ' +
          matchScoreClause
        : '* , ' + matchScoreClause;

    const whereClause = conditions.length
      ? 'WHERE ' + conditions.map((c) => `(${c})`).join(' OR ')
      : '';

    const offsetClause = skip ? `OFFSET ${skip}` : '';
    const limitClause = take ? `LIMIT ${take}` : '';
    const orderClause = order
      ? 'ORDER BY ' +
        Object.entries(order)
          .map(([key, direction]) => `"${key}" ${direction}`)
          .join(', ')
      : 'ORDER BY "match_score" DESC';

    const query = `
    SELECT ${selectedFields}
    FROM "users"
    ${whereClause}
    ${orderClause}
    ${limitClause}
    ${offsetClause}
  `.trim();

    const countQuery = `
    SELECT COUNT(*) FROM "users"
    ${whereClause}
  `.trim();

    const [result, total] = await Promise.all([
      this.pool.query(query, values),
      this.pool.query(countQuery, values),
    ]);

    return {
      users: result.rows.map((row) => {
        // remove match_score and password from the result
        delete row.match_score;
        delete row.password;
        return row;
      }),
      total: parseInt(total.rows[0].count, 10),
    };
  }
}
