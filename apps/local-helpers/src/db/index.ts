import { getDbConnection } from '@r8y/db';

export const dbClient = getDbConnection(Bun.env.DATABASE_URL!);
