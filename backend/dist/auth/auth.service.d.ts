import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateGoogleUser(profile: any): Promise<User>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    getProfile(userId: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        avatar: string | null;
        plan: import("@prisma/client").$Enums.Plan;
    }>;
}
