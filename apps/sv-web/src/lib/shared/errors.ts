import { TaggedError } from 'effect/Data';

export class AppError extends TaggedError('AppError') {
	status: number;
	body: App.Error;
	constructor(body: App.Error, status = 500) {
		super();
		this.message = body.message;
		this.cause = body.cause;
		this.body = body;
		this.status = status;
	}
}
