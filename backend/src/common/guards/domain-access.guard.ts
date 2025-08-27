import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

export type DomainAccessLevel = 'detal' | 'mayorista' | 'client';

@Injectable()
export class DomainAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const hostHeader = (req.headers['x-forwarded-host'] ||
      req.headers['host'] ||
      '') as string;
    const host = (hostHeader ?? '').toLowerCase();

    if (host.includes('clients.mayorista.guacadelreloj.com')) {
      req.domainAccessLevel = 'client';
    } else if (host.includes('mayoristas.guacadelreloj.com')) {
      req.domainAccessLevel = 'mayorista';
    } else if (host.includes('guacadelreloj.com')) {
      req.domainAccessLevel = 'detal';
    } else {
      // Default to detal for unknown hosts
      req.domainAccessLevel = 'detal';
    }

    return true;
  }
}
