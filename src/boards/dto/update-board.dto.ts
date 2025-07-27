import { PartialType } from "@nestjs/swagger";
import { CreateBoardDto } from "./create-board.dto";

export class UpdateBoardtDto extends PartialType(CreateBoardDto) {}