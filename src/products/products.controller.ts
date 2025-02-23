import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  Inject,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.client.send('create_product', body);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send('find_all_products', paginationDto);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('find_one_product', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    // console.log(body);
    return this.client.send('update_product', { id, ...body }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('delete_product', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
