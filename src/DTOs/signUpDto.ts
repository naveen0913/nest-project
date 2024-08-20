import { IsEmail, IsNotEmpty, IsString, Min } from "class-validator";

export class SignUPDto{
    
    @IsString()
    @IsNotEmpty()
    @Min(3)
    userName:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @IsString()
    @IsNotEmpty()
    @Min(5)
    password:string
}