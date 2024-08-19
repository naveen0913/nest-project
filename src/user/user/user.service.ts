import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../userEntity';
import { Repository } from 'typeorm';
import { SignUPDto } from 'src/DTOs/signUpDto';
import { LoginDto } from 'src/DTOs/loginDto';
import { JwtService } from '@nestjs/jwt';
import { updateDto } from 'src/DTOs/updateDto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async createUser(signUpDto: SignUPDto): Promise<any> {
        const { email, userName, password } = signUpDto;
        const existedUser = await this.userRepository.findOne({ where: { email } });

        if (existedUser) {
            throw new ConflictException('User with this email already exists');
        }

        const newUser = this.userRepository.create({
            userName,
            email,
            password,
            created: new Date()
        })
        return this.userRepository.save(newUser);

    }

    async userLogin(loginDto: LoginDto): Promise<any> {
        const { email, password } = loginDto;

        const existedUser = await this.userRepository.findOne({ where: { email } });

        if (!existedUser) {
            throw new UnauthorizedException('Invalid credentials');
        }


        if (password !== existedUser.password) {
            throw new UnauthorizedException('Incorrect Password');
        }
        const payload = {
            id: existedUser.id,
            email: existedUser.email,
            userName: existedUser.userName,
            password: existedUser.password,
            created: existedUser.created
        }
        const token = this.jwtService.sign(payload, { expiresIn: '2m' });
        return {
            token,
            expiresIn: 120,
        };

    }

    async getUserById(id: number): Promise<any> {
        const existedUserById = await this.userRepository.findOne({ where: { id } });

        if (!existedUserById) {
            throw new NotFoundException("User not found by ID");
        }

        return existedUserById;
    }

    async updateUser(id: number, updateUserDTO: updateDto): Promise<any> {
        const existedUserById = await this.userRepository.findOne({ where: { id } });
        if (!existedUserById) {
            throw new NotFoundException("User not found by ID");
        }

        const updatedUser = this.userRepository.merge(existedUserById, updateUserDTO);

        return this.userRepository.save(updatedUser);

    }

    async deleteUser(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException("User not found by ID");
        }
    }
}