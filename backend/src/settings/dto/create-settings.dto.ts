import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  pixKey?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsBoolean()
  creditCardAvailable?: boolean;
}

