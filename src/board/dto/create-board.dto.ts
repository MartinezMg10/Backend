import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
    IsPositive, IsString, MinLength 
} from 'class-validator';


export class CreateBoardDto {

@IsString()
@MinLength(1)
title: string;

@IsString()
@IsOptional()
description?: string;

@IsString({ each: true })
@IsOptional()
image_url?: string;


@IsString({ each: true })
@IsOptional()
visibility?: string;
}
