import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  DataSource,
  FindManyOptions,
} from 'typeorm';

export abstract class BaseCrudController<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(model: any, dataSource: DataSource) {
    this.repository = dataSource.getRepository(model);
  }

  @Get()
  async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.repository.find(options);
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
  async create(@Body() data: T): Promise<T> {
    const entity = this.repository.create(data);

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
