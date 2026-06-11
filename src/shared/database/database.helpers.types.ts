import { Database } from './database.types';

type PublicSchema = Database['public'];

type Tables = PublicSchema['Tables'];

type TableName = keyof Tables;

type Row<T extends TableName> = Tables[T]['Row'];

type Insert<T extends TableName> = Tables[T]['Insert'];

type Update<T extends TableName> = Tables[T]['Update'];

type Column<T extends TableName> = Extract<keyof Row<T>, string>;

export type { Column, Insert, Row, TableName, Update };
