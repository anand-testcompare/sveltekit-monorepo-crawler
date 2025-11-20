import { DB_SCHEMA, getDrizzleInstance } from '@r8y/db';
import { Effect } from 'effect';
import { TaggedError } from 'effect/Data';

class DbError extends TaggedError('DbError') {
	constructor(message: string, options?: { cause?: unknown }) {
		super();
		this.message = message;
		this.cause = options?.cause;
	}
}

const dbService = Effect.gen(function* () {
	const dbUrl = yield* Effect.sync(() => Bun.env.MYSQL_URL);

	if (!dbUrl) {
		return yield* Effect.die('MYSQL_URL is not set...');
	}

	const drizzle = yield* Effect.acquireRelease(
		Effect.try(() => getDrizzleInstance(dbUrl)),
		(db) => Effect.sync(() => db.$client.end())
	).pipe(
		Effect.catchAll((err) => {
			console.error('Failed to connect to database...', err);
			return Effect.die('Failed to connect to database...');
		})
	);

	return {
		getAllChannels: () =>
			Effect.gen(function* () {
				const channels = yield* Effect.tryPromise({
					try: () => drizzle.select().from(DB_SCHEMA.channels),
					catch: (err) =>
						new DbError('Failed to get all channels...', {
							cause: err
						})
				});

				return channels;
			})
	};
});

export class DbService extends Effect.Service<DbService>()('DbService', {
	dependencies: [],
	scoped: dbService
}) {}
