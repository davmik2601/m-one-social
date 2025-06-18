import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '@Modules/auth/dto/login.dto';
import { RegisterDto } from '@Modules/auth/dto/register.dto';
import { AuthType } from '@Modules/auth/types/auth.type';
import { JwtAuthPayloadType } from '@Modules/auth/types/jwt-auth-payload.type';
import { CreateUserDto } from '@Modules/user/dto/create-user.dto';
import { User } from '@Modules/user/types/user.model';
import { UserService } from '@Modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<AuthType> {
    const existingUser = await this.userService.findOne({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUserDto: CreateUserDto = {
      ...data,
      password: hashedPassword,
    };
    const newUser = await this.userService.create(newUserDto);

    return this.generateTokens(newUser);
  }

  async login({ email, password }: LoginDto): Promise<AuthType> {
    const user = await this.validateUser(email, password);

    return this.generateTokens(user);
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<User, 'id' | 'email'>> {
    const user = await this.userService.findOne({ where: { email } });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return {
          id: user.id,
          email: user.email,
        };
      }
    }

    throw new UnauthorizedException('Credentials are not valid');
  }

  async generateTokens(user: Pick<User, 'id' | 'email'>): Promise<AuthType> {
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    } as JwtAuthPayloadType);

    return { accessToken };
  }
}
