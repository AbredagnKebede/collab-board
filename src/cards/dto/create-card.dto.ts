import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, isString } from "class-validator";

export class CreateCardDto { 
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;   

    @IsNotEmpty()
    listId: number;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsArray()
    assigneeIds?: number[];
}