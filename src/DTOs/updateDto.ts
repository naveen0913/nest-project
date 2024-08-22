import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class updateDto{

    @IsOptional()
    @IsNotEmpty()
    userName?: string;

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    password?: string;
}