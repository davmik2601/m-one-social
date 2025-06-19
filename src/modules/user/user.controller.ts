import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ReqUserType } from '@Common/types/req-user.type';
import { AuthUser } from '@Decorators/auth-user.decorator';
import { UpdateMeDto } from '@Modules/user/dto/update-me.dto';
import { UserSearchDto } from '@Modules/user/dto/user-search.dto';
import { GetMeType } from '@Modules/user/types/get-me.type';
import { UserListType } from '@Modules/user/types/user-list.type';
import { UserService } from '@Modules/user/user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ type: GetMeType })
  async getMe(@AuthUser() user: ReqUserType): Promise<GetMeType> {
    return this.userService.getMe(user);
  }

  @Patch('/me')
  @ApiOperation({ summary: 'Update me' })
  @ApiResponse({ type: GetMeType })
  async updateMe(
    @AuthUser() user: ReqUserType,
    @Body() data: UpdateMeDto,
  ): Promise<GetMeType> {
    return this.userService.updateMe(user, data);
  }

  @Get('/search')
  @ApiOperation({ summary: 'Update me' })
  @ApiResponse({ type: UserListType })
  async search(@Query() qData: UserSearchDto): Promise<UserListType> {
    return this.userService.search(qData);
  }
}
