import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async create(data: Partial<User>) {
    return this.userModel.create(data as User); // change
  }

  async findByEmail(email: string) {
    const res = this.userModel.findOne({
      where: { email },
      attributes: { include: ['password'] },
    });
    return res;
  }

  async findById(id: number) {
    return this.userModel.findByPk(id);
  }
}
