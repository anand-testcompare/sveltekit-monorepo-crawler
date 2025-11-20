import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as mySchema from './schema';

export const getDbConnection = (dbUrl: string) => {
	const connection = mysql.createPool(dbUrl);
	return drizzle(connection, { mode: 'default', schema: mySchema });
};

export const getDrizzleInstance = (dbUrl: string) =>
	drizzle(dbUrl, { mode: 'default', schema: mySchema });

// export const createDbConnection = (dbUrl: string) => mysql.createConnection(dbUrl);

// export const getDrizzleInstance = (connection: mysql.Pool) =>
// 	drizzle(connection, { mode: 'default', schema: mySchema });

export type DbConnection = ReturnType<typeof getDbConnection>;
