import { ResultAsync } from 'neverthrow';
import { dbClient } from '.';
import { DB_SCHEMA } from '@r8y/db';

export const DB_QUERIES = {
	getAllChannels: async () => {
		const result = await ResultAsync.fromPromise(
			dbClient.select().from(DB_SCHEMA.channels),
			() => new Error('Failed to get all channels')
		);
		return result.match(
			(channels) => channels,
			(error) => {
				throw error;
			}
		);
	}
};
