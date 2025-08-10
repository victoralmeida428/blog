import {AppError} from "@/app/api/errors/AppError";

export class AuthenticationError extends AppError {
    constructor() {
        super('Invalid username or password');
        this.status = 401;
        this.name = 'AuthenticationError';
    }
}