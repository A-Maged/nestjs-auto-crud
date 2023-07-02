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
import { Repository, FindOptionsWhere, DataSource } from 'typeorm';

export abstract class BaseCrudController<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(model: any, dataSource: DataSource) {
    this.repository = dataSource.getRepository(model);
  }

  @Get()
  async findAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<T[]> {
    return this.repository.find({ take: take || 10, skip: skip || 0 });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<T> {
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
    const entity = this.repository.create(data as T);

    return this.repository.save(entity);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Partial<T>): Promise<T> {
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
    const result = await this.repository.delete(id);

    return {
      isDeleted: result.affected > 0,
    };
  }
}
