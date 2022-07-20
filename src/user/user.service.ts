import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toUserDto } from 'src/shared/mapper';
import { comparePasswords } from 'src/shared/utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)    
        private readonly userRepo: Repository<UserEntity>, ) {}

        async findOne(options?: object): Promise<UserDto> {
            const user =  await this.userRepo.findOne(options);    
            return toUserDto(user);  
        }

        async findByLogin({ email, password }: LoginUserDto): Promise<UserDto> {    
            const user = await this.userRepo.findOne({ where: { email } });
            
            if (!user) {
                throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
            }
            
            // compare passwords    
            const areEqual = await comparePasswords(user.password, password);
            
            if (!areEqual) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
            }
            
            return toUserDto(user);  
        }

        async findByPayload({ id }: any): Promise<UserDto> {
            return await this.findOne({ 
                where:  { id } });  
        }

        async create(userDto: CreateUserDto): Promise<UserDto> {    
            const { username, password, email } = userDto;
            
            // check if the user exists in the db    
            const userInDb = await this.userRepo.findOne({ 
                where: { email } 
            });
            if (userInDb) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
            }
            
            const user: UserEntity = await this.userRepo.create({ username, password, email, });
            await this.userRepo.save(user);
            return toUserDto(user);  
        }

    get() {
        return {id: 1, name: "Ore Faseru", date:"19/07/2022"}
    }

    createUser(body: any){
        return {message: "User Created", body};
    }

    deleteUser(param: {userId: number}){
        return {message: `User deleted successfully`, param}
    }

    editUser(param: {userId: number}, body: any){
        return {message: `User Edit successfully`, param, body}
    }

    loginUser(body: any){
        return {message: "User login", body}
    }

    logoutUser(body: any){
        return {message: "User logout", body}
    }

    forgotPassword(body: any){
        return {message: "Forgot Password", body}
    }

    resetPassword(body: any){
        return {message: "Reset Password", body}
    }

    getUserPosts(param: {userId: number}){
        return {message: "User Posts", param}
    }
}
