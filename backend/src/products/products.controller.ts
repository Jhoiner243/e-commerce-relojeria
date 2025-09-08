import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    // Combinar el DTO con el archivo subido
    const productData: CreateProductDto = {
      ...createProductDto,
      precio: +createProductDto.precio,
      imagen,
    };

    return this.productsService.create(productData);
  }

  @Get()
  findAll(@Query('take') take?: string, @Query('cursor') cursor?: string) {
    const takeNumber = take ? parseInt(take, 10) : 20;

    // Validate take parameter
    if (take && (isNaN(takeNumber) || takeNumber <= 0 || takeNumber > 100)) {
      throw new BadRequestException(
        'Take parameter must be a positive number between 1 and 100',
      );
    }

    return this.productsService.findAllPaginated(takeNumber, cursor);
  }

  @Get('all')
  findAllWithInactive() {
    return this.productsService.findAllWithInactive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.productsService.softDelete(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.productsService.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
