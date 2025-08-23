import { Controller, Post, Body, Get, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('folders')
@UseGuards(AuthGuard('jwt'))
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto, @Req() req: Request) {
   const userId = (req.user as any).id;
    return this.foldersService.createFolder(userId, createFolderDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.foldersService.getUserFolders(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    return this.foldersService.updateFolder(userId, id, updateFolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.foldersService.deleteFolder(userId, id);
  }
}