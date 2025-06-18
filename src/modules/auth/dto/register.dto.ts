import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';

import { TextService } from '@Helpers/services/text.service';

export class RegisterDto {
  @Transform(
    ({ value }) =>
      value && TextService.upperCaseFirst(TextService.trimAllSpaces(value)),
  )
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @Transform(
    ({ value }) =>
      value && TextService.upperCaseFirst(TextService.trimAllSpaces(value)),
  )
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsInt()
  @Min(18)
  @Max(99)
  @ApiProperty({ minimum: 18, maximum: 99, example: 18 })
  age: number;

  @Transform(
    ({ value }) => value && TextService.trimAllSpaces(value).toLowerCase(),
  )
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  @ApiProperty()
  password: string;
}
