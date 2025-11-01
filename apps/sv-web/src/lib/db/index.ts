import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { getDbConnection, type DbConnection } from '@r8y/db';

const globalForDb = globalThis as unknown as {
	client: DbConnection | undefined;
};

export const dbClient = globalForDb.client ?? getDbConnection(env.DATABASE_URL);

if (dev) globalForDb.client = dbClient;
