import { Prisma } from '~/core/prisma';
import { ICursorData } from '~/shared/types';

const encodeCursor = (record: Prisma.SubscriptionsModel): string => {
  const cursorData: ICursorData = {
    createdAt: record.createdAt.toISOString(),
    id: record.id,
  };
  return Buffer.from(JSON.stringify(cursorData)).toString('base64');
};

const decodeCursor = (cursor: string) => {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    return JSON.parse(decoded) as ICursorData;
  } catch {
    throw new Error('Invalid cursor format');
  }
};

const buildCursorCondition = (cursor: string, sortOrder: 'asc' | 'desc') => {
  const decoded = decodeCursor(cursor);
  const op = sortOrder === 'asc' ? 'gt' : 'lt';

  return {
    OR: [
      { createdAt: { [op]: new Date(decoded.createdAt) } },
      {
        createdAt: new Date(decoded.createdAt),
        id: { [op]: decoded.id },
      },
    ],
  };
};

export { encodeCursor, decodeCursor, buildCursorCondition };
