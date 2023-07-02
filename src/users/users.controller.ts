import { BaseCrudController } from 'src/BaseCrudController';
import { User } from './user.model';
import { Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserDTO } from './user.dto';

@Controller('/users')
export class UsersController extends BaseCrudController<User> {
  constructor(dataSource: DataSource) {
    const validators = {
      create: UserDTO,
    };

    super(User, dataSource, validators);
  }
}
