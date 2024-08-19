import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class updateDto{

    @IsOptional()
    userName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    password?: string;
}