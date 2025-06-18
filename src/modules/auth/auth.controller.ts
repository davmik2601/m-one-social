import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@Decorators/public.decorator';
import { AuthService } from '@Modules/auth/auth.service';
import { LoginDto } from '@Modules/auth/dto/login.dto';
import { RegisterDto } from '@Modules/auth/dto/register.dto';
import { AuthType } from '@Modules/auth/types/auth.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ type: AuthType })
  async login(@Body() data: LoginDto): Promise<AuthType> {
    return this.authService.login(data);
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ type: AuthType })
  async registerUser(@Body() data: RegisterDto): Promise<AuthType> {
    return this.authService.register(data);
  }
}
