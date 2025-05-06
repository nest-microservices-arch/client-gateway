import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
  import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor (
      @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Token not found');
      }
      try {

        const { user, token: tokenResponse } = await firstValueFrom(
          this.client.send('auth.verify.user', token)
        );

        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = user;
        request['token'] = tokenResponse;
      } catch {
        throw new UnauthorizedException('Token not valid');
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }