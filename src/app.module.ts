import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from '@Database/database.module';
import { AllExceptionsFilter } from '@Filters/all-exceptions.filter';
import { JwtAuthGuard } from '@Guards/jwt-auth.guard';
import { AuthModule } from '@Modules/auth/auth.module';
import { FriendModule } from '@Modules/friend/friend.module';
import { FriendRequestModule } from '@Modules/friend-request/friend-request.module';
import { UserModule } from '@Modules/user/user.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    FriendRequestModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
