import { Operators, SQL } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

export type ListOptions<ColumnType> = {
  sortKey?:
    | (keyof ColumnType | SQL | PgColumn)
    | (() => keyof ColumnType | SQL | PgColumn);
  sortOrder?: 'asc' | 'desc';
  sortFn?: () => [keyof ColumnType | SQL, 'asc' | 'desc'];
  query?: string;
  filter?: (column: ColumnType, operators: Operators) => SQL[];
};
