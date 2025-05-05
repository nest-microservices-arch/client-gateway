import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto)
    .pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto)
    .pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verify(@Req() req: Request) {

    const user = req['user'];
    const token = req['token'];
    console.log(user, token);
    

    return this.client.send('auth.verify.user', {});
  }
}
