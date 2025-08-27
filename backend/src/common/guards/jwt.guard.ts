/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException('Falta Authorization');
    const [scheme, token] = String(auth).split(' ');
    if (scheme !== 'Bearer' || !token)
      throw new UnauthorizedException('Token inválido');
    try {
      const json = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
      (req as any).user = json;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
