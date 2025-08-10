export type SessionDTO = {
    id: string,
    userId: number,
    expiresAt: Date,
}


export class Session {
    constructor(
        public readonly id: string,
        public readonly userId: number,
        public _expiresAt: Date,
    ) {
    }

    get expiresAt() {
        return this._expiresAt;
    }

    invalidate() {
        this._expiresAt = new Date();
    }

    static reconstitute(data: SessionDTO): Session {
        return new Session(
            data.id,
            data.userId,
            data.expiresAt,
        );
    }
}