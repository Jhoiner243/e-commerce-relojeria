import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
