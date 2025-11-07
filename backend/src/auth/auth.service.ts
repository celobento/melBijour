import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto';

const PASSWORD_SALT_ROUNDS = 10;

type UserResponse = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  googleId?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private toUserResponse(user: UserResponse): UserResponse {
    return { ...user };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: UserRole.USER,
      },
    });

    return { user: this.toUserResponse(user) };
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { user: this.toUserResponse(user) };
  }

  async handleGoogleAuth(dto: GoogleAuthDto) {
    if (!dto.googleId) {
      throw new UnauthorizedException('Missing Google account identifier');
    }

    let user = await this.prisma.user.findUnique({
      where: { googleId: dto.googleId },
    });

    if (!user && dto.email) {
      user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
    }

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: dto.googleId,
          name: dto.name ?? user.name,
          avatarUrl: dto.image ?? user.avatarUrl,
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          name: dto.name ?? 'MelBijour User',
          email: dto.email ?? `user-${dto.googleId}@melbijour.com`,
          googleId: dto.googleId,
          avatarUrl: dto.image,
          role: UserRole.USER,
        },
      });
    }

    return { user: this.toUserResponse(user) };
  }
}
