import { Injectable } from '@nestjs/common';

import { ReqUserType } from '@Common/types/req-user.type';
import { FindOneOptions } from '@Database/types/find-options.interface';
import { CreateUserDto } from '@Modules/user/dto/create-user.dto';
import { UpdateMeDto } from '@Modules/user/dto/update-me.dto';
import { GetMeType } from '@Modules/user/types/get-me.type';
import { User } from '@Modules/user/types/user.model';
import { UserRepository } from '@Modules/user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }

  async getMe(user: ReqUserType): Promise<GetMeType> {
    // return needed fields only
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
    };
  }

  async updateMe(user: ReqUserType, data: UpdateMeDto): Promise<GetMeType> {
    await this.userRepository.update({ id: user.id }, data);

    user = { ...user, ...data }; // Override user object with new data for get me

    return this.getMe(user);
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne(options);
  }
}
