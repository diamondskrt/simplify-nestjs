import { Injectable } from '@nestjs/common';

import { Prisma, PrismaService } from '~/core/prisma';
import { buildCursorCondition, encodeCursor } from '~/shared/lib';
import { IBasePaginationResult } from '~/shared/types';

import { SortBy } from './config';
import { IFindAllOptions } from './types';

@Injectable()
export class SubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    userId,
    options = {},
  }: {
    userId: string;
    options: IFindAllOptions;
  }): Promise<IBasePaginationResult<Prisma.SubscriptionsModel>> {
    const {
      limit = 20,
      after = null,
      sortOrder = 'desc',
      search = '',
      sortBy = 'createdAt',
      paymentInterval = null,
      status = null,
    } = options;

    const where: Prisma.SubscriptionsWhereInput = {
      userId,
      ...(after && buildCursorCondition(after, sortOrder)),
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(paymentInterval && {
        paymentInterval: paymentInterval,
      }),
      ...(status && {
        status: status,
      }),
    };

    const orderBy: Prisma.SubscriptionsOrderByWithRelationInput[] = [];

    if (sortBy === SortBy.title) {
      orderBy.push({ title: sortOrder });
    } else if (sortBy === SortBy.price) {
      orderBy.push({ price: sortOrder });
    } else {
      orderBy.push({ createdAt: sortOrder });
    }

    orderBy.push({ id: sortOrder });

    const items = await this.prisma.subscriptions.findMany({
      where,
      orderBy,
      take: limit + 1,
    });

    const hasNextPage = items.length > limit;
    const data = hasNextPage ? items.slice(0, limit) : items;
    const nextCursor =
      hasNextPage && data.length > 0
        ? encodeCursor(data[data.length - 1])
        : null;
    const totalCount = items.length;

    return { data, nextCursor, hasNextPage, totalCount };
  }

  findById({ userId, id }: { userId: string; id: string }) {
    return this.prisma.subscriptions.findUnique({
      where: { userId, id },
    });
  }

  create({
    userId,
    data,
  }: {
    userId: string;
    data: Omit<Prisma.SubscriptionsCreateInput, 'userId'>;
  }) {
    return this.prisma.subscriptions.create({
      data: {
        ...data,
        userId: userId,
      },
    });
  }

  update({
    userId,
    id,
    data,
  }: {
    userId: string;
    id: string;
    data: Omit<Prisma.SubscriptionsUpdateInput, 'userId' | 'id'>;
  }) {
    return this.prisma.subscriptions.update({
      where: { userId, id },
      data,
    });
  }

  delete({ userId, id }: { userId: string; id: string }) {
    return this.prisma.subscriptions.delete({
      where: { userId, id },
    });
  }
}
