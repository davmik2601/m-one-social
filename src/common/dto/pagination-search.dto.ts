import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '@Common/dto/pagination.dto';

export class PaginationSearchDto extends PaginationDto {
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  q?: string;
}
