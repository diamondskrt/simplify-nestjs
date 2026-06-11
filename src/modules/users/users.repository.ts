import { Injectable } from '@nestjs/common';

import { Prisma, PrismaService } from '~/core/prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.UsersCreateInput) {
    return this.prisma.users.create({
      data,
    });
  }

  update(
    id: string,
    data: Pick<Prisma.UsersUpdateInput, 'firstName' | 'lastName' | 'avatarUrl'>
  ) {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
