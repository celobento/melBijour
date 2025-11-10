import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSalesHistoryDto } from './dto/create-sales-history.dto';
import { UpdateSalesHistoryDto } from './dto/update-sales-history.dto';

@Injectable()
export class SalesHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateSalesHistoryDto) {
    return this.prisma.salesHistory.create({
      data: this.toPrismaInput(data),
      include: {
        sales: true,
      },
    });
  }

  findAll() {
    return this.prisma.salesHistory.findMany({
      include: {
        sales: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const salesHistory = await this.prisma.salesHistory.findUnique({
      where: { id },
      include: {
        sales: true,
      },
    });

    if (!salesHistory) {
      throw new NotFoundException(`SalesHistory with id '${id}' not found`);
    }

    return salesHistory;
  }

  findBySalesId(salesId: string) {
    return this.prisma.salesHistory.findMany({
      where: { salesId },
      include: {
        sales: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: UpdateSalesHistoryDto) {
    return this.applyUpdate(id, data);
  }

  patch(id: string, data: UpdateSalesHistoryDto) {
    return this.applyUpdate(id, data);
  }

  async remove(id: string) {
    try {
      return await this.prisma.salesHistory.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`SalesHistory with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaInput(data: CreateSalesHistoryDto): Prisma.SalesHistoryCreateInput {
    return {
      sales: {
        connect: { id: data.salesId },
      },
      userId: data.userId,
      detail: data.detail,
      status: data.status,
    };
  }

  private async applyUpdate(id: string, data: UpdateSalesHistoryDto) {
    const existing = await this.prisma.salesHistory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`SalesHistory with id '${id}' not found`);
    }

    const updateData = this.toPrismaUpdateInput(data);

    if (Object.keys(updateData).length === 0) {
      return this.findOne(id);
    }

    try {
      return await this.prisma.salesHistory.update({
        where: { id },
        data: updateData,
        include: {
          sales: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`SalesHistory with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaUpdateInput(data: UpdateSalesHistoryDto): Prisma.SalesHistoryUpdateInput {
    const input: Prisma.SalesHistoryUpdateInput = {};

    if (data.salesId !== undefined) {
      input.sales = {
        connect: { id: data.salesId },
      };
    }
    if (data.userId !== undefined) {
      input.userId = data.userId;
    }
    if (data.detail !== undefined) {
      input.detail = data.detail;
    }
    if (data.status !== undefined) {
      input.status = data.status;
    }

    return input;
  }
}

