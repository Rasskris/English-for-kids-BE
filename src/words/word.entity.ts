import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../categories';
import { File } from '../files';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name: string;

  @Column()
  public translation: string;

  @JoinColumn()
  @OneToOne(() => File, { eager: true, nullable: true })
  public image: File;

  @JoinColumn()
  @OneToOne(() => File, { eager: true, nullable: true })
  public audio: File;

  @ManyToOne(() => Category, (category: Category) => category.words)
  public category: Category;
}
