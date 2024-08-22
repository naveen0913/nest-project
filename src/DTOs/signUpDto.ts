import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUPDto{
    
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    userName:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'Password must be at least 5 characters' })
    password:string
}