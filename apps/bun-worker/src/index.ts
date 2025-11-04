import { syncVideo } from '@r8y/channel-sync';

const main = async () => {
	const video = await syncVideo({
		ytVideoId: 'dQw4w9WgXcQ'
	});
};

main();
