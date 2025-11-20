import { ChannelSyncService, DbService } from '@r8y/channel-sync';
import { Effect, Fiber, pipe, Schedule } from 'effect';

const program = Effect.gen(function* () {
	const channelSync = yield* ChannelSyncService;

	yield* Effect.log('starting bg worker');
	yield* channelSync.syncAllChannels();
}).pipe(
	Effect.provide(ChannelSyncService.Default),
	// TODO: should probably wrap this in something so I'm not exposing the db service to the outside world
	Effect.provide(DbService.Default),
	Effect.matchCause({
		onSuccess: () => {
			console.log('finished bg worker');
		},
		onFailure: (cause) => {
			console.error('bg worker crashed', cause);
		}
	}),
	Effect.repeat(Schedule.spaced('30 minutes'))
);

const programFiber = Effect.runFork(program);

process.on('SIGINT', async () => {
	console.log('SIGINT received');
	await pipe(programFiber, Fiber.interrupt, Effect.runPromise);
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('SIGTERM received');
	await pipe(programFiber, Fiber.interrupt, Effect.runPromise);
	process.exit(0);
});
