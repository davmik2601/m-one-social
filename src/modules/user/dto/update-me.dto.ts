import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { TextService } from '@Helpers/services/text.service';

export class UpdateMeDto {
  @Transform(
    ({ value }) =>
      value && TextService.upperCaseFirst(TextService.trimAllSpaces(value)),
  )
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  firstName?: string;

  @Transform(
    ({ value }) =>
      value && TextService.upperCaseFirst(TextService.trimAllSpaces(value)),
  )
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  lastName?: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  @ApiPropertyOptional({ minimum: 18, maximum: 99, example: 18 })
  age?: number;
}
