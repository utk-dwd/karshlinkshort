import { Injectable, NotFoundException } from '@nestjs/common';
    import { JwtService } from '@nestjs/jwt';
    import { PrismaService } from '../prisma/prisma.service';
    import { User } from '@prisma/client';

    @Injectable()
    export class AuthService {
      constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
      ) {}

      // Method for GoogleStrategy to find or create a user
      async validateGoogleUser(profile: any): Promise<User> {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const avatar = photos[0]?.value;

        let user = await this.prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await this.prisma.user.create({
            data: {
              email,
              name: displayName,
              avatar,
              provider: 'google',
              providerId: id,
            },
          });
        }
        return user;
      }

      // Method for AuthController to create a JWT
      async login(user: User) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      // Method for AuthController's /me endpoint
      async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            plan: true,
          },
        });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }
    }
    