import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class EmailVerification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;     

    @Column()
    token: string;

    @CreateDateColumn()
    createdAt: Date;
}