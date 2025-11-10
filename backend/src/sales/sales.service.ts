import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSalesDto } from './dto/create-sales.dto';
import { UpdateSalesDto } from './dto/update-sales.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSalesDto) {
    const salesData = this.toPrismaInput(data);
    
    // If salesProducts are provided, include them in the create
    if (data.salesProducts && data.salesProducts.length > 0) {
      salesData.salesProducts = {
        create: data.salesProducts.map((sp) => ({
          product: {
            connect: { id: sp.productId },
          },
          qtd: sp.qtd,
          unitVlr: sp.unitVlr,
          totalValue: sp.totalValue,
        })),
      };
    }

    return this.prisma.sales.create({
      data: salesData,
      include: {
        customer: true,
        salesProducts: {
          include: {
            product: true,
          },
        },
        salesHistory: true,
      },
    });
  }

  findAll() {
    return this.prisma.sales.findMany({
      include: {
        customer: true,
        salesProducts: {
          include: {
            product: true,
          },
        },
        salesHistory: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sales.findUnique({
      where: { id },
      include: {
        customer: true,
        salesProducts: {
          include: {
            product: true,
          },
        },
        salesHistory: true,
      },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with id '${id}' not found`);
    }

    return sale;
  }

  update(id: string, data: UpdateSalesDto) {
    return this.applyUpdate(id, data);
  }

  patch(id: string, data: UpdateSalesDto) {
    return this.applyUpdate(id, data);
  }

  async remove(id: string) {
    try {
      return await this.prisma.sales.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Sale with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaInput(data: CreateSalesDto): Prisma.SalesCreateInput {
    const input: Prisma.SalesCreateInput = {
      customer: {
        connect: { id: data.customerId },
      },
      total: data.total,
    };

    if (data.state !== undefined) {
      input.state = data.state;
    }

    return input;
  }

  private async applyUpdate(id: string, data: UpdateSalesDto) {
    const existing = await this.prisma.sales.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Sale with id '${id}' not found`);
    }

    const updateData = this.toPrismaUpdateInput(data);

    if (Object.keys(updateData).length === 0) {
      return this.findOne(id);
    }

    try {
      return await this.prisma.sales.update({
        where: { id },
        data: updateData,
        include: {
          customer: true,
          salesProducts: {
            include: {
              product: true,
            },
          },
          salesHistory: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Sale with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaUpdateInput(data: UpdateSalesDto): Prisma.SalesUpdateInput {
    const input: Prisma.SalesUpdateInput = {};

    if (data.customerId !== undefined) {
      input.customer = {
        connect: { id: data.customerId },
      };
    }
    if (data.total !== undefined) {
      input.total = data.total;
    }
    if (data.state !== undefined) {
      input.state = data.state;
    }

    return input;
  }
}

