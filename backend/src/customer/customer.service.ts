import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: this.toPrismaInput(data),
      include: { user: true },
    });
  }

  findAll() {
    return this.prisma.customer.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id '${id}' not found`);
    }

    return customer;
  }

  update(id: string, data: UpdateCustomerDto) {
    return this.applyUpdate(id, data);
  }

  patch(id: string, data: UpdateCustomerDto) {
    return this.applyUpdate(id, data);
  }

  async remove(id: string) {
    try {
      return await this.prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Customer with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaInput(data: CreateCustomerDto | UpdateCustomerDto) {
    const input: Prisma.CustomerCreateInput = {};

    if (data.name !== undefined) input.name = data.name;
    if (data.image !== undefined) input.image = data.image;
    if (data.phone !== undefined) input.phone = data.phone;
    if (data.address !== undefined) input.address = data.address;
    if (data.addressNumber !== undefined) {
      input.addressNumber = data.addressNumber
        ? Number(data.addressNumber)
        : null;
    }
    if (data.zipCode !== undefined) input.zipCode = data.zipCode;
    if (data.complement !== undefined) input.complement = data.complement;
    if (data.city !== undefined) input.city = data.city;
    if (data.state !== undefined) input.state = data.state;

    return input;
  }

  private async applyUpdate(id: string, data: UpdateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      throw new NotFoundException(`Customer with id '${id}' not found`);
    }

    const updateData = this.toPrismaUpdateInput(data);

    if (Object.keys(updateData).length === 0) {
      return existing;
    }

    try {
      return await this.prisma.customer.update({
        where: { id },
        data: updateData,
        include: { user: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Customer with id '${id}' not found`);
      }
      throw error;
    }
  }

  private toPrismaUpdateInput(data: UpdateCustomerDto): Prisma.CustomerUpdateInput {
    const input: Prisma.CustomerUpdateInput = {};

    if (data.name !== undefined) input.name = data.name;
    if (data.image !== undefined) input.image = data.image;
    if (data.phone !== undefined) input.phone = data.phone;
    if (data.address !== undefined) input.address = data.address;
    if (data.addressNumber !== undefined) {
      input.addressNumber = data.addressNumber
        ? Number(data.addressNumber)
        : null;
    }
    if (data.zipCode !== undefined) input.zipCode = data.zipCode;
    if (data.complement !== undefined) input.complement = data.complement;
    if (data.city !== undefined) input.city = data.city;
    if (data.state !== undefined) input.state = data.state;

    return input;
  }
}
