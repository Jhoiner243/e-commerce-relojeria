import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
