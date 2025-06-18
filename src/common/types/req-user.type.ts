import { User } from '@Modules/user/types/user.model';

export type ReqUserType = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'email' | 'age'
>;
