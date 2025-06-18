import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get('JWT_SECRET', 'm_one_jwt_secret'),
  signOptions: {
    expiresIn: config.get('JWT_EXP', '30d')!,
  },
});

export const jwtOptions = (): JwtModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
