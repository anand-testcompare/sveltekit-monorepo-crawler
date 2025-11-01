import { query } from '$app/server';

export const remoteDemo = query(async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return {
		message: 'asdf'
	};
});
