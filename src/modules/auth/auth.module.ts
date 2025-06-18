import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { jwtOptions } from '@Modules/auth/config/jwt-module-async-options';
import { JwtStrategy } from '@Modules/auth/strategies/jwt-strategy';
import { UserModule } from '@Modules/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.registerAsync(jwtOptions()), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
