import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Word } from '../words';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public name: string;

  @OneToMany(() => Word, (word: Word) => word.category)
  public words: Word[];
}
