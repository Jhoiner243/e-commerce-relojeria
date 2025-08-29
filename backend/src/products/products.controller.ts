import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { DomainAccessGuard } from '../common/guards/domain-access.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

type DomainAwareRequest = Request & {
  domainAccessLevel?: 'detal' | 'mayorista' | 'client';
};

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
      imagen,
    };

    return this.productsService.create(productData);
  }

  @UseGuards(DomainAccessGuard)
  @Get()
  findAll(@Req() req: DomainAwareRequest) {
    const access = req.domainAccessLevel;
    if (access === 'client') {
      return this.productsService.findAllFiltered({ visibility: 'client' });
    }
    if (access === 'mayorista') {
      return this.productsService.findAllFiltered({ visibility: 'mayorista' });
    }
    return this.productsService.findAllFiltered({ visibility: 'detal' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
