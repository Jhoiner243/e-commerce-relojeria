import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    ProductsModule,
    AdminModule,
    CategoriasModule,
    PromotionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
