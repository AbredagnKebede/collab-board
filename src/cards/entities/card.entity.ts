import { List } from "src/lists/entities/list.entity";
import { User } from "src/users/entities/user.entity";
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn } from "typeorm";
import { Comment } from "src/comments/entities/comment.entity";

@Entity()
export class Card{
    @PrimaryGeneratedColumn()
    id: number;     

    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({type: 'timestamp', nullable: true})
    dueDate: Date;

    @Column({type: 'int', default: 0})
    order: number;

    @ManyToOne(() => List, list => list.cards, {onDelete: "CASCADE"})
    list: List;

    @ManyToMany(() => User)
    @JoinTable()
    assignees: User[];

    @OneToMany(() => Comment, comment => comment.card)
    comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;
}