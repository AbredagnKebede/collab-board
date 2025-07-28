import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Board } from "src/boards/entities/board.entity";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @ManyToOne(() => User, user => user.projects)
    createdBy: User;

    @ManyToMany(() => User, user => user.projectsAsMember)
    @JoinTable()
    members: User[];
    
    @OneToMany(() => Board, board => board.project, { cascade: true })
    boards: Board[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
