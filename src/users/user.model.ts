import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  country: string;
}
