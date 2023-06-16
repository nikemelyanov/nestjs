import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { Watchlist } from '../watchlist/models/watchlist.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { email: email },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      dto.password = await this.hashPassword(dto.password);
      const newUser = {
        firstName: dto.firstName,
        username: dto.username,
        email: dto.email,
        password: dto.password,
      };
      await this.userRepository.create(newUser);
      return dto;
    } catch (err) {
      throw new Error(err);
    }
  }

  async publicUser(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { email: email },
        attributes: { exclude: ['password'] },
        include: {
          model: Watchlist,
          required: false,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      await this.userRepository.update(dto, { where: { email: email } });
      return dto;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.userRepository.destroy({ where: { email: email } });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}
