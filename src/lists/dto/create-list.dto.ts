import { IsNotEmpty, IsUUID, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  boardId: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
