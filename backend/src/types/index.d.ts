import { DomainAccessLevel } from '../common/guards/domain-access.guard';

declare global {
  namespace Express {
    interface Request {
      domainAccessLevel?: DomainAccessLevel;
    }
  }
}
