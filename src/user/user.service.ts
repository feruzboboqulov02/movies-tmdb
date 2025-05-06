import { Injectable } from '@nestjs/common';
import { users } from '../mocks';

@Injectable()
export class UserService {
  private users = [];
  getAllUsers() {
    return users;
  }
  createUser(user: User) {
    const newUser = { id: Date.now(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  deleteUserById(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      return { message: 'User not found' };
    }
    this.users.splice(index, 1);
    return { message: 'User deleted successfully' };
  }
}
