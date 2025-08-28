import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [PrismaModule, ProductsModule, AdminModule, CategoriasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
