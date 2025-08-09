import {AppError} from "@/app/api/errors/AppError";

export class InternalError extends AppError{
    status: number = 500;
    constructor() {
        super('Internal Error Server');
        this.name = 'InternalError';
    }
}