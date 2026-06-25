interface IBasePaginationOptions {
  limit?: number;
  after?: string | null;
  sortOrder?: 'desc' | 'asc';
  search?: string;
}

interface IBasePaginationResult<T> {
  data: T[];
  totalCount: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

type ICursorData = {
  id: string;
  createdAt: string;
};

export type { IBasePaginationOptions, IBasePaginationResult, ICursorData };
