import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { FolderColor } from '@prisma/client';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FolderColor)
  color: FolderColor;
}