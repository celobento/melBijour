import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: this.toPrismaInput(data),
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }

    return product;
  }

  update(id: string, data: UpdateProductDto) {
    return this.applyUpdate(id, data);
  }

  patch(id: string, data: UpdateProductDto) {
    return this.applyUpdate(id, data);
  }

  async remove(id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaInput(data: CreateProductDto): Prisma.ProductCreateInput {
    const input: Prisma.ProductCreateInput = {
      name: data.name,
      value: data.value,
      productCategory: data.productCategory,
    };

    if (data.description !== undefined) input.description = data.description;
    if (data.image !== undefined) input.image = data.image;
    if (data.currentStock !== undefined) {
      input.currentStock = data.currentStock;
    }

    return input;
  }

  private async applyUpdate(id: string, data: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }

    const updateData = this.toPrismaUpdateInput(data);

    if (Object.keys(updateData).length === 0) {
      return existing;
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaUpdateInput(data: UpdateProductDto): Prisma.ProductUpdateInput {
    const input: Prisma.ProductUpdateInput = {};

    if (data.name !== undefined) input.name = data.name;
    if (data.description !== undefined) input.description = data.description;
    if (data.image !== undefined) input.image = data.image;
    if (data.currentStock !== undefined) {
      input.currentStock = data.currentStock;
    }
    if (data.value !== undefined) input.value = data.value;
    if (data.productCategory !== undefined) {
      input.productCategory = data.productCategory;
    }

    return input;
  }
}

