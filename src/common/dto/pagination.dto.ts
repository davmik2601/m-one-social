import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => (value === '' ? undefined : parseInt(value, 10)))
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  skip?: number;

  @Transform(({ value }) => (value === '' ? undefined : parseInt(value, 10)))
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  take?: number;
}
