import { BaseCrudController } from 'src/BaseCrudController';
import { User } from './user.model';
import { Controller } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('/users')
export class UsersController extends BaseCrudController<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
