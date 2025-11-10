import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSettingsDto) {
    try {
      
      const { companyName, companyId, pixKey, phone, email, logo, creditCardAvailable } = data;
  
      // Validation
      if (!companyName) {
        throw new BadRequestException("Company name is required");
      }
  
      // Check if settings already exist
      const existingSettings = await this.prisma.settings.findFirst();
  
      let settings;
      if (existingSettings) {
        // Update existing settings
        settings = await this.prisma.settings.update({
          where: { id: existingSettings.id },
          data: {
            companyName: companyName.trim(),
            companyId: companyId?.trim() || null,
            pixKey: pixKey?.trim() || null,
            phone: phone?.trim() || null,
            email: email?.trim() || null,
            logo: logo?.trim() || null,
            creditCardAvailable: creditCardAvailable || false,
          },
        });
      } else {
        // Create new settings
        settings = await this.prisma.settings.create({
          data: {
            companyName: companyName.trim(),
            companyId: companyId?.trim() || null,
            pixKey: pixKey?.trim() || null,
            phone: phone?.trim() || null,
            email: email?.trim() || null,
            logo: logo?.trim() || null,
            creditCardAvailable: creditCardAvailable || false,
          },
        });
      }
  
      return {
        message: "Settings saved successfully",
        settings: {
          ...settings,
          createdAt: settings.createdAt.toISOString(),
          updatedAt: settings.updatedAt.toISOString(),
        },
      };
    } catch (error: any) {
      console.error("Error saving settings:", error);
      throw new InternalServerErrorException(error.message || "Failed to save settings");
    }
  }

  findLogoName() {
    return this.prisma.settings.findFirst({
      select: {
        companyName: true,
        logo: true,
      },
    });
  }

  findPixKey() {
    return this.prisma.settings.findFirst({
      select: {
        pixKey: true,
      },
    });
  }

  findAdmin() {
    return this.prisma.settings.findFirst({
      select: {
        companyName: true,
        logo: true,
        pixKey: true,
        phone: true,
        email: true,
        creditCardAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findAll() {
    return this.prisma.settings.findMany();
  }

  async findOne(id: string) {
    const settings = await this.prisma.settings.findUnique({
      where: { id },
    });

    if (!settings) {
      throw new NotFoundException(`Settings with id '${id}' not found`);
    }

    return settings;
  }

  update(id: string, data: UpdateSettingsDto) {
    return this.applyUpdate(id, data);
  }

  patch(id: string, data: UpdateSettingsDto) {
    return this.applyUpdate(id, data);
  }

  async remove(id: string) {
    try {
      return await this.prisma.settings.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Settings with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaInput(data: CreateSettingsDto): Prisma.SettingsCreateInput {
    const input: Prisma.SettingsCreateInput = {
      companyName: data.companyName,
    };
    if (data.companyId !== undefined) input.companyId = data.companyId;
    if (data.pixKey !== undefined) input.pixKey = data.pixKey;
    if (data.phone !== undefined) input.phone = data.phone;
    if (data.email !== undefined) input.email = data.email;
    if (data.logo !== undefined) input.logo = data.logo;
    if (data.creditCardAvailable !== undefined) {
      input.creditCardAvailable = data.creditCardAvailable;
    }

    return input;
  }

  private async applyUpdate(id: string, data: UpdateSettingsDto) {
    const existing = await this.prisma.settings.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Settings with id '${id}' not found`);
    }

    const updateData = this.toPrismaUpdateInput(data);

    if (Object.keys(updateData).length === 0) {
      return existing;
    }

    try {
      return await this.prisma.settings.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Settings with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaUpdateInput(data: UpdateSettingsDto): Prisma.SettingsUpdateInput {
    const input: Prisma.SettingsUpdateInput = {};

    if (data.companyName !== undefined) input.companyName = data.companyName;
    if (data.companyId !== undefined) input.companyId = data.companyId;
    if (data.pixKey !== undefined) input.pixKey = data.pixKey;
    if (data.phone !== undefined) input.phone = data.phone;
    if (data.email !== undefined) input.email = data.email;
    if (data.logo !== undefined) input.logo = data.logo;
    if (data.creditCardAvailable !== undefined) {
      input.creditCardAvailable = data.creditCardAvailable;
    }

    return input;
  }
}

