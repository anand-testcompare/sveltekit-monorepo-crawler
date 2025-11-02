import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

export const checkAuth = (event: RequestEvent) => {
	const authPassword = event.cookies.get('authPassword');
	if (!authPassword) return false;
	if (authPassword !== env.SECRET_PASSWORD) return false;
	return true;
};
