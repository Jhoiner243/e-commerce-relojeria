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
import { UpdateGeneralPriceDto } from './dto/update-general-price.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateWholesaleDto } from './dto/update-wholesale.dto';
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

  @Get('search')
  findSeacrh(@Query('q') q: string) {
    return this.productsService.findSearch(q);
  }

  @Get()
  findAll(
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
    @Query('gender') gender?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('category') category?: string,
  ) {
    const takeNumber = take ? parseInt(take, 10) : 20;

    // Validate take parameter
    if (take && (isNaN(takeNumber) || takeNumber <= 0 || takeNumber > 100)) {
      throw new BadRequestException(
        'Take parameter must be a positive number between 1 and 100',
      );
    }

    // Parse price filters
    const minPriceNumber = minPrice ? parseFloat(minPrice) : undefined;
    const maxPriceNumber = maxPrice ? parseFloat(maxPrice) : undefined;

    // Validate price parameters
    if (minPrice && isNaN(minPriceNumber!)) {
      throw new BadRequestException('minPrice must be a valid number');
    }
    if (maxPrice && isNaN(maxPriceNumber!)) {
      throw new BadRequestException('maxPrice must be a valid number');
    }

    return this.productsService.findAllPaginated(
      takeNumber,
      cursor,
      gender,
      minPriceNumber,
      maxPriceNumber,
      category,
    );
  }

  @Get('all')
  findAllWithInactive() {
    return this.productsService.findAllWithInactive();
  }

  @Get('mayorista')
  findAllMayorista(
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
    @Query('gender') gender?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('category') category?: string,
  ) {
    console.log('findAllMayorista', gender, minPrice, maxPrice, category);
    const takeNumber = take ? parseInt(take, 10) : 20;

    // Validate take parameter
    if (take && (isNaN(takeNumber) || takeNumber <= 0 || takeNumber > 100)) {
      throw new BadRequestException(
        'Take parameter must be a positive number between 1 and 100',
      );
    }

    // Parse price filters
    const minPriceNumber = minPrice ? parseFloat(minPrice) : undefined;
    const maxPriceNumber = maxPrice ? parseFloat(maxPrice) : undefined;

    // Validate price parameters
    if (minPrice && isNaN(minPriceNumber!)) {
      throw new BadRequestException('minPrice must be a valid number');
    }
    if (maxPrice && isNaN(maxPriceNumber!)) {
      throw new BadRequestException('maxPrice must be a valid number');
    }

    return this.productsService.findAllPaginatedMayorista(
      takeNumber,
      cursor,
      gender,
      minPriceNumber,
      maxPriceNumber,
      category,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
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

  @Patch(':id/wholesale')
  updateWholesale(
    @Param('id') id: string,
    @Body() updateWholesaleDto: UpdateWholesaleDto,
  ) {
    return this.productsService.updateWholesale(id, updateWholesaleDto);
  }

  @Patch(':id/general-price')
  updateGeneralPrice(
    @Param('id') id: string,
    @Body() updateGeneralPriceDto: UpdateGeneralPriceDto,
  ) {
    return this.productsService.updateGeneralPrice(id, updateGeneralPriceDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  update(
    @Param('id') id: string,
    @Body() body: Record<string, string | boolean>,
  ) {
    const dto: UpdateProductDto = {
      ...(body as Record<string, unknown>),
    } as UpdateProductDto;

    if (body && body['precio'] !== undefined) {
      (dto as unknown as { precio?: number }).precio = Number(
        body['precio'] as string,
      );
    }
    if (body && body['isActive'] !== undefined) {
      const val = body['isActive'];
      (dto as unknown as { isActive?: boolean }).isActive =
        val === true || val === 'true' || val === '1';
    }
    if (body && body['mayorista'] !== undefined) {
      const val = body['mayorista'];
      (dto as unknown as { mayorista?: boolean }).mayorista =
        val === true || val === 'true' || val === '1';
    }
    if (
      body &&
      body['mayoristaPrice'] !== undefined &&
      body['mayoristaPrice'] !== ''
    ) {
      (dto as unknown as { mayoristaPrice?: number }).mayoristaPrice = Number(
        body['mayoristaPrice'] as string,
      );
    }

    return this.productsService.update(id, dto);
  }
}
