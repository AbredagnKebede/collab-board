import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmailVerification } from "./email-verification.entity";

export class EmailVerificationService{
    constructor(
        @InjectRepository(EmailVerification)
        private readonly emailVerificationRepository: Repository<EmailVerification>) {}
    
    async generateToken(userId: number): Promise<string> {
        const token = Math.random().toString(36).substring(2, 15);
        const emailVerification = this.emailVerificationRepository.create({
            userId,
            token
        });
        await this.emailVerificationRepository.save(emailVerification);
        return token;
    }

    async verifyToken(token: string): Promise<number | null> {
        const record = await this.emailVerificationRepository.findOne({ where: { token } });
        if(!record) return null;
    
        await this.emailVerificationRepository.delete(record.id);
        return record.userId;
    }
}