/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma';

export class AdminRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async findFirst(email: string): Promise<any> {
    return await this.prisma.admin.findFirst({
      where: {
        email,
      },
    });
  }
}
