import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Word } from '../words';
import { File } from '../files';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public name: string;

  @OneToMany(() => Word, (word: Word) => word.category)
  public words: Word[];

  @JoinColumn()
  @OneToOne(() => File, { eager: true, nullable: true })
  public image: File;
}
