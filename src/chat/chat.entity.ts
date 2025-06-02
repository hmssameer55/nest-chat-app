import { Message } from 'src/message/message.entity';
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToOne(() => Message, { nullable: true })
  @JoinColumn()
  lastMessage: Message;

  @CreateDateColumn()
  createdAt: Date;
}
