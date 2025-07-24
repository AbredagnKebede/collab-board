import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/Passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
