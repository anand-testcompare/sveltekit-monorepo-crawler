import { dbClient } from '$lib/db';
import { DB_SCHEMA } from '@r8y/db';

export const load = async () => {
	const testing = await dbClient.select().from(DB_SCHEMA.channels);
	console.log(testing);
	const result = [
		{
			name: 'Channel 1'
		},
		{
			name: 'Channel 2'
		},
		{
			name: 'Channel 3'
		}
	];

	return {
		channels: result
	};
};
