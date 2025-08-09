export class InternalError extends Error {
    status: number = 500;

    constructor() {
        super('Internal Error Server');
        this.name = 'InternalError';
    }
}