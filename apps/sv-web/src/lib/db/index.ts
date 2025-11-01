import { dev } from '$app/environment';
import { DATABASE_URL } from '$env/static/private';
import { getDbConnection, type DbConnection } from '@r8y/db';

const globalForDb = globalThis as unknown as {
	client: DbConnection | undefined;
};

export const dbClient = globalForDb.client ?? getDbConnection(DATABASE_URL);

if (dev) globalForDb.client = dbClient;
