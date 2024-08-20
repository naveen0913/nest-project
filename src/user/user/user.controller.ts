import { Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUPDto } from 'src/DTOs/signUpDto';
import { LoginDto } from 'src/DTOs/loginDto';
import { Request, Response } from 'express';
import { UserGuard } from '../user.guard';
import { updateDto } from 'src/DTOs/updateDto';

interface CustomRequest extends Request {
    user?: any;
}

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post("signup")
    async userSignUp(@Body() signUpDto: SignUPDto): Promise<{ code: number, message: string }> {
        try {
            await this.userService.createUser(signUpDto);
            return {
                code: HttpStatus.CREATED,
                message: "created",
            }
        } catch (error) {
            if (error instanceof ConflictException) {
                return {
                    message: error.message,
                    code: HttpStatus.CONFLICT,
                };
            }
            throw error;
        }
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async userLogin(@Body() loginDto: LoginDto): Promise<{ code: number, token: string, expiresIn: number }> {
        const { token, expiresIn } = await this.userService.userLogin(loginDto);
        return {
            code: HttpStatus.OK,
            token,
            expiresIn,
        };
    }

    @Get('get')
    @UseGuards(UserGuard)
    @HttpCode(HttpStatus.OK)
    async getAuthenticatedUser(@Req() request: CustomRequest, @Res() response: Response): Promise<any> {
        try {
            const user = await request.user;
            return response.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                message: 'Login Successful',
                user: user
            });
        } catch (error) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: error.message,
            });
        }

    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.userService.getUserById(id);

    }

    @Put('update/:id')
    // @UseGuards(UserGuard)
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateDto: updateDto): Promise<any> {
        await this.userService.updateUser(id, updateDto);

        return {
            code: HttpStatus.OK,
            message: 'updated',
        }

    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
        await this.userService.deleteUser(id);
        return {
            code: HttpStatus.OK,
            message: 'deleted',
        }
    }

    @Get()
    getllUsers() {
        return this.userService.findAll();
    }

}
