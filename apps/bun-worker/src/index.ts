import { DB_QUERIES } from './db/queries';

const main = async () => {
	const channels = await DB_QUERIES.getAllChannels();
	console.log(channels);
};

main().catch(console.error);
