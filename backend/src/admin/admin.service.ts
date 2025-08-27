import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  private hashPassword(raw: string): string {
    // Very basic hash. In production, use bcrypt/argon2.
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  async validateAdmin(email: string, password: string) {
    if (!admin) throw new UnauthorizedException('Credenciales inválidas');
    const hashed = this.hashPassword(password);

    if (hashed !== admin.password)
      throw new UnauthorizedException('Credenciales inválidas');
    return { id: admin.id, nombre: admin.nombre, email: admin.email };
  }
}
