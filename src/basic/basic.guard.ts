import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as basicAuth from 'basic-auth';
import { Observable } from 'rxjs';


@Injectable()
export class BasicGuard implements CanActivate {
  // private readonly validUsername = 'admin';
  //   private readonly validPassword = 'password';
  private readonly validUsername = process.env.BASIC_AUTH_USERNAME;
  private readonly validPassword = process.env.BASIC_AUTH_PASSWORD;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    const credentials = basicAuth(request);

    if (credentials && credentials.name === this.validUsername && credentials.pass === this.validPassword) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }

  }
}


