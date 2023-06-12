import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/guards/jwt-guard';
import { CreateUserDTO } from '../users/dto';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto';
import { AuthUserResponse } from './response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServise: AuthService) {}

  @ApiTags('API')
  @ApiResponse({ status: 201, type: CreateUserDTO })
  @HttpCode(201)
  @Post('register')
  register(@Body() dto: CreateUserDTO): Promise<CreateUserDTO> {
    return this.authServise.registerUsers(dto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: AuthUserResponse })
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: UserLoginDTO): Promise<AuthUserResponse> {
    return this.authServise.loginUser(dto);
  }

  @UseGuards(jwtAuthGuard)
  @Post('test')
  test() {
    return true;
  }
}
