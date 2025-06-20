import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SendFriendRequestParamsDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  receiverId: number;
}
