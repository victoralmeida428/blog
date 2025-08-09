export class AppError extends Error {
    status: number = 400;
    constructor(message: string) {
        super(message);
        this.name = 'AppError';
    }
}