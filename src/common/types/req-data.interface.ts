import { Request } from 'express';

import { ReqUserType } from '@Common/types/req-user.type';

export interface ReqDataInterface extends Request {
  user?: ReqUserType;
}
