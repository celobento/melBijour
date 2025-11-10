import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSalesProductDto } from './dto/create-sales-product.dto';
import { UpdateSalesProductDto } from './dto/update-sales-product.dto';

@Injectable()
export class SalesProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateSalesProductDto) {
    return this.prisma.salesProduct.create({
      data: this.toPrismaInput(data),
      include: {
        sales: true,
        product: true,
      },
    });
  }

  findAll() {
    return this.prisma.salesProduct.findMany({
      include: {
        sales: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const salesProduct = await this.prisma.salesProduct.findUnique({
      where: { id },
      include: {
        sales: true,
        product: true,
      },
    });

    if (!salesProduct) {
      throw new NotFoundException(`SalesProduct with id '${id}' not found`);
    }

    return salesProduct;
  }

  findBySalesId(salesId: string) {
    return this.prisma.salesProduct.findMany({
      where: { salesId },
      include: {
        sales: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: UpdateSalesProductDto) {
    return this.applyUpdate(id, data);
  }

  patch(id: string, data: UpdateSalesProductDto) {
    return this.applyUpdate(id, data);
  }

  async remove(id: string) {
    try {
      return await this.prisma.salesProduct.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`SalesProduct with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaInput(data: CreateSalesProductDto): Prisma.SalesProductCreateInput {
    return {
      sales: {
        connect: { id: data.salesId },
      },
      product: {
        connect: { id: data.productId },
      },
      qtd: data.qtd,
      unitVlr: data.unitVlr,
      totalValue: data.totalValue,
    };
  }

  private async applyUpdate(id: string, data: UpdateSalesProductDto) {
    const existing = await this.prisma.salesProduct.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`SalesProduct with id '${id}' not found`);
    }

    const updateData = this.toPrismaUpdateInput(data);

    if (Object.keys(updateData).length === 0) {
      return this.findOne(id);
    }

    try {
      return await this.prisma.salesProduct.update({
        where: { id },
        data: updateData,
        include: {
          sales: true,
          product: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`SalesProduct with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaUpdateInput(data: UpdateSalesProductDto): Prisma.SalesProductUpdateInput {
    const input: Prisma.SalesProductUpdateInput = {};

    if (data.salesId !== undefined) {
      input.sales = {
        connect: { id: data.salesId },
      };
    }
    if (data.productId !== undefined) {
      input.product = {
        connect: { id: data.productId },
      };
    }
    if (data.qtd !== undefined) {
      input.qtd = data.qtd;
    }
    if (data.unitVlr !== undefined) {
      input.unitVlr = data.unitVlr;
    }
    if (data.totalValue !== undefined) {
      input.totalValue = data.totalValue;
    }

    return input;
  }
}

