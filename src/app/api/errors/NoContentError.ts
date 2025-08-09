import {AppError} from "@/app/api/errors/AppError";

export class NoContentError extends AppError {
    status: number = 204;

    constructor() {
        super('');
        this.name = 'NoContentError';
    }
}