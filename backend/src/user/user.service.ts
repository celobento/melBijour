import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      include: {
        customer: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    return user;
  }

  update(id: string, data: UpdateUserDto) {
    return this.applyUpdate(id, data);
  }

  patch(id: string, data: UpdateUserDto) {
    return this.applyUpdate(id, data);
  }

  private async applyUpdate(id: string, data: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    const updateData: Prisma.UserUpdateInput = {};
    const customerUpdate: Prisma.CustomerUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl;
    }
    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    if (data.image !== undefined) {
      customerUpdate.image = data.image;
      if (updateData.avatarUrl === undefined) {
        updateData.avatarUrl = data.image;
      }
    }

    if (data.phone !== undefined) {
      customerUpdate.phone = data.phone;
    }
    if (data.address !== undefined) {
      customerUpdate.address = data.address;
    }
    if (data.addressNumber !== undefined) {
      customerUpdate.addressNumber = data.addressNumber
        ? Number(data.addressNumber)
        : null;
    }
    if (data.zipCode !== undefined) {
      customerUpdate.zipCode = data.zipCode;
    }
    if (data.complement !== undefined) {
      customerUpdate.complement = data.complement;
    }
    if (data.city !== undefined) {
      customerUpdate.city = data.city;
    }
    if (data.state !== undefined) {
      customerUpdate.state = data.state;
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new BadRequestException(
          'Current password is required to set a new password',
        );
      }

      if (!existingUser.passwordHash) {
        throw new BadRequestException('User does not have a password set');
      }

      const matches = await bcrypt.compare(
        data.currentPassword,
        existingUser.passwordHash,
      );

      if (!matches) {
        throw new BadRequestException('Current password is incorrect');
      }

      updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);
    }

    if (Object.keys(customerUpdate).length > 0) {
      updateData.customer = {
        update: customerUpdate,
      };
    }

    if (Object.keys(updateData).length === 0) {
      return existingUser;
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: { customer: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with id '${id}' not found`);
      }

      throw error;
    }
  }
}

