import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Project, project => project.boards, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => User, user => user.boards)
    createdBy: User;
    
    @CreateDateColumn()
    createdAt: Date;    
}