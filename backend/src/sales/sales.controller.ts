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
import { CreateSalesDto } from './dto/create-sales.dto';
import { UpdateSalesDto } from './dto/update-sales.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSalesDto: CreateSalesDto) {
    return this.salesService.create(createSalesDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSalesDto: UpdateSalesDto) {
    return this.salesService.update(id, updateSalesDto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateSalesDto: UpdateSalesDto) {
    return this.salesService.patch(id, updateSalesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}

