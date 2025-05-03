import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('login')
  login() {
    return this.client.send('auth.login.user', {});
  }

  @Post('register')
  register() {
    return this.client.send('auth.register.user', {});
  }

  @Post('verify')
  verify() {
    return this.client.send('auth.verify.user', {});
  }
}
