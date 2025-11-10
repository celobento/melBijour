import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SalesProductService } from './sales-product.service';
import { CreateSalesProductDto } from './dto/create-sales-product.dto';
import { UpdateSalesProductDto } from './dto/update-sales-product.dto';

@Controller('sales-products')
export class SalesProductController {
  constructor(private readonly salesProductService: SalesProductService) {}

  @Post()
  create(@Body() createSalesProductDto: CreateSalesProductDto) {
    return this.salesProductService.create(createSalesProductDto);
  }

  @Get()
  findAll() {
    return this.salesProductService.findAll();
  }

  @Get('sales/:salesId')
  findBySalesId(@Param('salesId') salesId: string) {
    return this.salesProductService.findBySalesId(salesId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesProductService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesProductDto: UpdateSalesProductDto
  ) {
    return this.salesProductService.update(id, updateSalesProductDto);
  }

  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() updateSalesProductDto: UpdateSalesProductDto
  ) {
    return this.salesProductService.patch(id, updateSalesProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesProductService.remove(id);
  }
}

