import { checkAuth } from '$lib/auth/helpers';

export const handle = async ({ event, resolve }) => {
	event.locals.checkAuth = checkAuth;

	return resolve(event);
};
