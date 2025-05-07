import { Injectable } from '@nestjs/common';
import { users } from '../mocks';
import { v4 } from 'uuid';

export interface IUser {
  id?: any;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private users: IUser[] = [];
  getAllUsers() {
    return users;
  }
  createUser(user: IUser) {
    const newUser = { ...user, id: v4() };
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

  updateUSer(id: number, user: IUser) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return { message: 'User not found' };
    }
    this.users[index] = user;
    return { message: 'User updated successfully' };
  }

  patchUser(id: number, partialUser: Partial<IUser>) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return { message: 'User not found' };
    }
    this.users[index] = { ...this.users[index], ...partialUser };
    return this.users[index];
  }
}
