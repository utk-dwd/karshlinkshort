// backend/src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This guard redirects the user to Google's consent screen
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user as any);
    
    // IMPORTANT FIX: Redirecting to the correct Vite port (8080)
    res.redirect(`http://localhost:8080/auth/callback?token=${access_token}`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request) {
    // req.user is populated by the JwtStrategy with { id: string, email: string }
    const userId = (req.user as any).id;
    const userProfile = await this.authService.getProfile(userId);
    if (!userProfile) {
        throw new NotFoundException('User not found');
    }
    return userProfile;
  }
}