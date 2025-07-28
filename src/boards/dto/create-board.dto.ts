import { IsNotEmpty, IsString, IsNumber } from "class-validator"

export class CreateBoardDto {
    @IsNotEmpty()
    @IsString()
    title: string; 

    @IsNumber()
    projectId: number;
}
