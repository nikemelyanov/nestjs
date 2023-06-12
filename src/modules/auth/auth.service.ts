import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../users/dto';
import { UsersService } from '../users/users.service';
import { AppError } from 'src/common/constants/errors';
import { UserLoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from './response';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenServise: TokenService,
  ) {}

  async registerUsers(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const existUser = await this.userService.findUserByEmail(dto.email);
    if (existUser) throw new BadRequestException(AppError.USER_EXIST);
    return this.userService.createUser(dto);
  }

  async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
    const existUser = await this.userService.findUserByEmail(dto.email);
    if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
    const validatePassword = await bcrypt.compare(dto.password, existUser.password);
    if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);
    const userData = {
      name: existUser.username,
      email: existUser.email
    }
    const token = await this.tokenServise.generateJwtToken(userData);
    const user = await this.userService.publicUser(dto.email)
    return {...user, token};
  }
}
