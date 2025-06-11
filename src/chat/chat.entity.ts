import { Message } from 'src/message/message.entity';
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Only two users per chat
  @ManyToOne(() => User, { eager: true })
  user1: User;

  @ManyToOne(() => User, { eager: true })
  user2: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToOne(() => Message, { nullable: true, eager: true })
  @JoinColumn()
  lastMessage: Message;

  @CreateDateColumn()
  createdAt: Date;
}
