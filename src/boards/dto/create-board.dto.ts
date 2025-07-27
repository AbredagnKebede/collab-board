import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CreateBoardDto {
    @IsNotEmpty()
    @IsString()
    title: string; 

    @IsUUID()
    peojectId: number;
}
