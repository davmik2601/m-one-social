import { Module } from '@nestjs/common';

import { DatabaseModule } from '@Database/database.module';

import { AppController } from './app.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
