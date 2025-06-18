import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ReqDataInterface } from '@Common/types/req-data.interface';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<ReqDataInterface>();

    return req.user || null;
  },
);
