import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor(private readonly configService: ConfigService){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS')
            },
        });
    }

    async sendVerificationEmail(email: string, token: string): Promise<void> {
        const baseUrl = this.configService.get<string>('SERVER_URL') || 'http://localhost:3000';
        const url = `${baseUrl}/auth/verify-email?token=${token}`;

        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: email,
            subject: 'Email Verification',
            html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
