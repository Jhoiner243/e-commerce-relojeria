import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProductsService } from './products/products.service';

@Module({
  imports: [ProductsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, ProductsService, AdminService],
})
export class AppModule {}
