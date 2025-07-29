import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  boardId: number;

  @IsOptional()
  @IsInt()
  order?: number;
}
