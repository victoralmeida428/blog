import {AppError} from "@/app/api/errors/AppError";

export class NotFoundError extends AppError {
    status: number = 404;
    constructor(resourceName: string) {
        super(`${resourceName} not found`);
        this.name =  'NotFoundError';
    }
}