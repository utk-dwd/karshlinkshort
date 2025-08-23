import { Controller, Post, Body, Get, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto, UpdateLinkDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createLinkDto: CreateLinkDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.linksService.createLink(userId, createLinkDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.linksService.getUserLinks(userId);
  }

  @Get(':shortCode')
  redirect(@Param('shortCode') shortCode: string, @Req() req: Request) {
    // Note: You need a separate endpoint to record clicks in the background
    // and another for redirection to the original URL.
    return this.linksService.redirectLink(shortCode);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.linksService.updateLink(userId, id, updateLinkDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.linksService.deleteLink(userId, id);
  }
}