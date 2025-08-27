/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { AdminRepository } from './repository/admin.repository';

@Injectable()
export class AdminService {
  constructor(
    @Inject(AdminRepository) private readonly adminRepository: AdminRepository,
  ) {}
  private async hashPassword(raw: string): Promise<string> {
    return hash(raw, 10) as Promise<string>;
  }

  async createAdmin(registro: RegisterDto) {
    await this.hashPassword(registro.password);

    const admin = await this.adminRepository.findFirst(registro.email);

    if (admin) throw new UnauthorizedException('El email ya existe');

    await this.adminRepository.create(registro);
  }

  private async validatePassword(hashed: string): Promise<boolean> {
    // Very basic hash. In production, use bcrypt/argon2.
    return compare(hashed, hashed) as Promise<boolean>;
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminRepository.findFirst(email);
    const hashed = await this.validatePassword(password);

    if (!admin) throw new UnauthorizedException('Credenciales inválidas');
    if (!hashed) throw new UnauthorizedException('Credenciales inválidas');

    return { admin };
  }
}
