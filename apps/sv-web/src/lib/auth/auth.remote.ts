import { command, getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import z from 'zod';
import { checkAuth } from './helpers';

export const remoteSignOut = command(async () => {
	const event = getRequestEvent();
	event.cookies.delete('authPassword', {
		path: '/'
	});
	return {
		success: true
	};
});

export const remoteSignIn = command(
	z.object({
		authPassword: z.string()
	}),
	async ({ authPassword }) => {
		const event = getRequestEvent();

		if (authPassword !== env.SECRET_PASSWORD) {
			return {
				success: false
			};
		}

		event.cookies.set('authPassword', authPassword, {
			path: '/',
			httpOnly: true,
			secure: true,
			maxAge: 60 * 60 * 24 * 10000 // forever
		});

		return {
			success: true
		};
	}
);

export const remoteCheckAuth = command(async () => {
	const event = getRequestEvent();
	return {
		isAuthenticated: checkAuth(event)
	};
});
