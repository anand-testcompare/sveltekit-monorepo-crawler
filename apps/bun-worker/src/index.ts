import { DbService } from '@r8y/channel-sync';
import { Effect } from 'effect';

const program = Effect.gen(function* () {
	yield* Effect.log('starting bg worker');
	const db = yield* DbService;

	const channels = yield* db.getAllChannels();

	yield* Effect.log(channels);
}).pipe(
	Effect.provide(DbService.Default),
	Effect.matchCause({
		onSuccess: () => {
			console.log('finished bg worker');
		},
		onFailure: (cause) => {
			console.error('bg worker crashed', cause);
		}
	})
);

Effect.runPromise(program);

// const main = async () => {
// 	const start = performance.now();
// 	const channels = await DB_QUERIES.getAllChannels();
// 	if (channels.isErr()) {
// 		console.error('LIVE CRAWLER CRASHED: Failed to get all channels', channels.error);
// 		return;
// 	}

// 	const channelsValue = channels.value;

// 	const allRecentVideosResults = await Promise.allSettled(
// 		channelsValue.map(async (channel) =>
// 			getRecentVideosForChannel({ ytChannelId: channel.ytChannelId })
// 		)
// 	);

// 	let successCount = 0;
// 	let errorCount = 0;

// 	for (const result of allRecentVideosResults) {
// 		if (result.status === 'fulfilled' && result.value.isOk()) {
// 			const recentVideos = result.value.value;
// 			await Promise.allSettled(
// 				recentVideos.map(async (video) => {
// 					console.log(`Syncing video ${video.videoId} - ${video.title}`);
// 					const syncVideoResult = await syncVideo({
// 						ytVideoId: video.videoId
// 					});
// 					if (syncVideoResult.isOk()) {
// 						successCount++;
// 						console.log(`Synced video ${video.videoId} - ${video.title}`);
// 					} else {
// 						errorCount++;
// 						console.error('LIVE CRAWLER CRASHED: Failed to sync video', syncVideoResult.error);
// 					}
// 				})
// 			);
// 		}
// 	}

// 	console.log(`LIVE CRAWLER COMPLETED: ${successCount} videos synced, ${errorCount} videos failed`);
// 	console.log(`LIVE CRAWLER TOOK ${performance.now() - start}ms`);
// };

// const THIRTY_MINUTES_MS = 30 * 60 * 1000;

// setInterval(() => {
// 	main();
// }, THIRTY_MINUTES_MS);

// main();
