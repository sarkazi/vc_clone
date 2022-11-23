import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUser(id: number): string {
    return `привет ${id}`;
  }
}
