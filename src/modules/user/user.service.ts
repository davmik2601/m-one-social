import { Injectable } from '@nestjs/common';

import { ReqUserType } from '@Common/types/req-user.type';
import { FindOneOptions } from '@Database/types/find-options.interface';
import { CreateUserDto } from '@Modules/user/dto/create-user.dto';
import { UpdateMeDto } from '@Modules/user/dto/update-me.dto';
import { UserSearchDto } from '@Modules/user/dto/user-search.dto';
import { UserRepository } from '@Modules/user/repositories/user.repository';
import { GetMeType } from '@Modules/user/types/get-me.type';
import { User } from '@Modules/user/types/user.model';
import { UserListType } from '@Modules/user/types/user-list.type';

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

  async search({
    skip = 0,
    take = 10,
    q,
  }: UserSearchDto): Promise<UserListType> {
    // if no any q searchTerm, return empty array with total count of users
    if (!q) {
      const total = await this.userRepository.count();
      return { users: [], total };
    }

    return this.userRepository.search(q, {
      skip,
      take,
    });
  }
}
