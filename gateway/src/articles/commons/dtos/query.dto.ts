import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min, min } from 'class-validator';
import { toNumber } from '../cast.helper';

export class QueryDto {
  @Transform(({ value }) => toNumber(value, 1))
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(1)
  public page: number = 1;

  @Transform(({ value }) => toNumber(value, 10))
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(1)
  public size: number = 10;
}
