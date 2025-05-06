import { Body, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('get-all-users')
  getUsers() {
    return this.UserService.getAllUsers();
  }
  @Post('create-user')
  createUser(@Body() body: any) {
    return this.UserService.createUser(body);
  }
}
