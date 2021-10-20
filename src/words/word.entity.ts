import { Category } from '../categories';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public name: string;

  @Column()
  public translation: string;

  @Column()
  public image: string;

  @Column()
  public audio: string;

  @ManyToOne(() => Category, (category: Category) => category.words)
  public category: Category;
}
