import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { IUser, UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Body() id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() body: IUser) {
    return this.userService.createUser(body);
  }

  @Post('')
  deleteUserById(@Body() id: number) {
    return this.userService.deleteUserById(id);
  }
  @Patch(':id')
  patchUser(@Body() id: number, @Body() partialUser: Partial<IUser>) {
    return this.userService.patchUser(id, partialUser);
  }
  @Put(':id')
  updateUSer(@Body() id: number, @Body() user: IUser) {
    return this.userService.updateUSer(id, user);
  }
}
