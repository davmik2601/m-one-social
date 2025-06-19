export interface FindAllOptions<T> {
  where?: WhereCondition<T>;
  select?: (keyof T)[];
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
  skip?: number;
  take?: number;
}

export interface FindOneOptions<T> {
  where?: WhereCondition<T>;
  select?: (keyof T)[];
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
}

export type WhereCondition<T> =
  | Partial<T>
  | {
      $or: Partial<T>[];
    };
