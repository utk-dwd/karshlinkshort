import { IsString, IsUrl, IsOptional, IsUUID, IsDateString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLinkDto {
  @IsUrl({}, { message: 'Must be a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @Length(3, 15, { message: 'Custom code must be between 3 and 15 characters' })
  customCode?: string;

  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  password?: string;
}