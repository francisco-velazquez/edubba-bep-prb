import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // La estrategia JwtStrategy adjuntó el objeto usuario a request.user
    return request.user; 
  },
);