import { Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma';
import { RegisterDto } from '../dto/register.dto';

export class AdminRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async create(admin: RegisterDto) {
    await this.prisma.admin.create({
      data: admin,
    });
  }

  async findFirst(email: string): Promise<{
    email: string;
    password: string;
    nombre: string;
    id: string;
  } | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (admin) return admin;

    return null;
  }
}
