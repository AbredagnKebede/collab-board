import { Board } from "src/boards/entities/board.entity";
import { Project } from "src/projects/entities/project.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from "typeorm";   

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @OneToMany(() => Project, project => project.createdBy)
    projects: Project[];

    @ManyToMany(() => Project, project => project.members)
    projectsAsMember: Project[];

    @OneToMany(() => Board, board => board.createdBy)
    boards: Board[];
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}