import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Repository, FindOptionsWhere, DataSource } from 'typeorm';
import { ClassType, CrudMethodName } from './types';

export abstract class BaseCrudController<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(
    model: any,
    dataSource: DataSource,
    protected validators: Record<CrudMethodName, ClassType> | {} = {},
  ) {
    this.repository = dataSource.getRepository(model);
  }

  @Get()
  async findAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<T[]> {
    await this.runValidators('findAll', { take, skip });

    return this.repository.find({ take: take || 10, skip: skip || 0 });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<T> {
    await this.runValidators('findById', { id });

    const entity = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  @Post()
  async create(@Body() data: any): Promise<T> {
    await this.runValidators('create', data);

    const entity = this.repository.create(data as T);

    return this.repository.save(entity);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Partial<T>): Promise<T> {
    await this.runValidators('update', data);

    const entity = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    Object.assign(entity, data);

    return this.repository.save(entity);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ isDeleted: boolean }> {
    await this.runValidators('delete', { id });

    const result = await this.repository.delete(id);

    return {
      isDeleted: result.affected > 0,
    };
  }

  private async runValidators(
    methodName: CrudMethodName,
    data: any,
  ): Promise<void> {
    const ValidatorClass = this.validators[methodName];

    if (ValidatorClass) {
      const validatorInstance = plainToInstance(ValidatorClass, data);

      const validationErrors = await validate(validatorInstance);

      if (validationErrors.length > 0) {
        throw validationErrors;
      }
    }
  }
}
