import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; 
      return true;
  } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
  }
  }
}
