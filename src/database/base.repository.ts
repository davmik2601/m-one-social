import { Pool, QueryResult } from 'pg';

import {
  FindAllOptions,
  FindOneOptions,
  WhereCondition,
} from '@Database/types/find-options.interface';

/** Original code by: davmik2601, */
/** For: */
/** --------------------------------------------------------------------------
 *      *         *               * *       *       *   * * * *
 *      *  *   *  *    ____     *     *     *  *    *   *
 *      *    *    *            *       *    *   *   *   * * * *
 *      *         *             *     *     *     * *   *
 *      *         *               * *       *       *   * * * *
 --------------------------------------------------------------------------  */

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This is a BASE REPOSITORY class that provides basic CRUD operations
 * for any entity (table). And all other repositories will extend this class.
 * (the CRUD methods are familiar to the ones in TypeORM)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export class BaseRepository<T> {
  protected tableName!: string;

  constructor(protected readonly pool: Pool) {}

  /** Basic Create method, with data args */
  async create(data: Partial<T>): Promise<T> {
    // filter out undefined values from data
    const keys = Object.keys(data).filter(
      (key) => data[key as keyof T] !== undefined,
    );
    const values = keys.map((key) => data[key as keyof T]);

    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
    const quotedKeys = keys.map((key) => `"${key}"`).join(', ');

    const query = `
        INSERT INTO "${this.tableName}" (${quotedKeys}) 
        VALUES (${placeholders}) RETURNING *`;
    const result = await this.pool.query(query, values);

    return result.rows[0];
  }

  /** Basic Update method, with filters and data args */
  async update(filters: Partial<T>, data: Partial<T>): Promise<QueryResult> {
    // filter out undefined values from data
    const dataKeys = Object.keys(data).filter(
      (key) => data[key as keyof T] !== undefined,
    );
    const dataValues = dataKeys.map((key) => data[key as keyof T]);

    // filter out undefined values from filters
    const filterKeys = Object.keys(filters).filter(
      (key) => filters[key as keyof T] !== undefined,
    );
    const filterValues = filterKeys.map((key) => filters[key as keyof T]);

    const setClause = dataKeys
      .map((key, idx) => `"${key}" = $${idx + 1}`)
      .join(', ');

    const whereClause = filterKeys
      .map((key, idx) => `"${key}" = $${dataKeys.length + idx + 1}`)
      .join(' AND ');

    const query = `
        UPDATE "${this.tableName}" 
        SET ${setClause} 
        WHERE ${whereClause}`;

    return this.pool.query(query, [...dataValues, ...filterValues]);
  }

  /** Basic FindAll method, with options for where, select, order, skip, and take */
  async findAll(options: FindAllOptions<T> = {}): Promise<T[]> {
    const { where = {}, select, order, skip, take } = options;
    const { clause: whereClause, values } = this.buildWhereClause(where);

    const selectedFields =
      select && select.length
        ? select.map((key) => `"${String(key)}"`).join(', ')
        : '*';

    const orderClause = order
      ? 'ORDER BY ' +
        Object.entries(order)
          .map(([key, direction]) => `"${key}" ${direction}`)
          .join(', ')
      : '';

    const offsetClause = skip ? `OFFSET ${skip}` : '';
    const limitClause = take ? `LIMIT ${take}` : '';

    const query = `
        SELECT ${selectedFields} 
        FROM "${this.tableName}" 
        ${whereClause} 
        ${orderClause} 
        ${limitClause} 
        ${offsetClause}`.trim();
    const result = await this.pool.query(query, values);

    return result.rows;
  }

  /** Basic FindOne method, which returns the first found record */
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    const results = await this.findAll({ ...options, take: 1 });

    return results[0] || null;
  }

  async count(where: WhereCondition<T> = {}): Promise<number> {
    const { clause: whereClause, values } = this.buildWhereClause(where);

    const query = `SELECT COUNT(*) FROM "${this.tableName}" ${whereClause}`;
    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  /** Basic Delete method, which deletes a record by its ID */
  async delete(id: number): Promise<QueryResult> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;

    return this.pool.query(query, [id]);
  }

  /** Helper methods * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  private buildWhereClause(
    where: WhereCondition<T>,
    alias = '',
  ): {
    clause: string;
    values: any[];
  } {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const prefix = alias ? `${alias}.` : '';

    if ('$or' in where && Array.isArray(where.$or)) {
      const orConditions = where.$or.map((cond: Partial<T>) => {
        return Object.entries(cond)
          .map(([key, value]) => {
            values.push(value);
            return `${prefix}"${key}" = $${paramIndex++}`;
          })
          .join(' AND ');
      });

      if (orConditions.length) {
        conditions.push(`(${orConditions.map((c) => `(${c})`).join(' OR ')})`);
      }
    } else {
      for (const [key, value] of Object.entries(where)) {
        values.push(value);
        conditions.push(`${prefix}"${key}" = $${paramIndex++}`);
      }
    }

    const clause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    return { clause, values };
  }
}
