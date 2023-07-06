import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateListDto {
    
    @MinLength(1)
    @IsString()
    title:string

    @IsUUID()
    boardId:string
}
