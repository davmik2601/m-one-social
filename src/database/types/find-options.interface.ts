export interface FindAllOptions<T> {
  where?: Partial<T>;
  select?: (keyof T)[];
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
  skip?: number;
  take?: number;
}

export interface FindOneOptions<T> {
  where?: Partial<T>;
  select?: (keyof T)[];
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
}
