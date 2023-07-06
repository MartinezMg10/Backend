import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly JwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    
    try {
      
      const { password, ...userData} = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password,10)
      });

      await this.userRepository.save( user )
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id})
      }
      //JWT

    } catch (error) {
      this,this.HandleDBErrors(error)
    }
  }

  async login(loginUserDto:LoginUserDto){

    const { password,email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where:{email},
      select: {email:true, password:true,id:true,firstName:true}
    })

    if(!user)
    throw new UnauthorizedException('Credentials are not valid (email)') 

    if(!bcrypt.compareSync(password,user.password))
    throw new UnauthorizedException('Credentials are not valid (password)') 

    return {
      ...user,
    token:this.getJwtToken({ id: user.id})}
  }

  private getJwtToken( payload: JwtPayload ){
    const token = this.JwtService.sign( payload );
    return token
  }


  private HandleDBErrors(error:any):never{
    if( error.code === '23505')
    throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }

} 
