export type PostDTO = {
    id: number,
    title: string,
    content: string | null,
    isPublished: boolean,
    createdAt: Date,
    authorId: number,
}

export type PostCreateInput = {
    title: string,
    content: string | null,
    isPublished: boolean,
    authorId: number,
}

export class Post {
    constructor(
        public readonly id: number | null,
        public title: string,
        public content: string | null,
        private _isPublished: boolean,
        public readonly createdAt: Date | null,
        public readonly authorId: number,
    ) {
    }

    get excertpt(): string {
        return (this.content ?? '').length > 100
            ? this.content!.substring(0, 100).concat('...')
            : this.content ?? '';
    }

    publish(): void {
        if (this._isPublished) {
            throw new Error("Post is already published");
        }

        this._isPublished = true;
    }

    isPublished(): boolean {
        return this._isPublished;
    }

    toDTO(): PostDTO {
        return {
            title: this.title,
            content: this.content,
            isPublished: this._isPublished,
            createdAt: this.createdAt,
            authorId: this.authorId,
            id: this.id
        }
    }

    static create(data: PostCreateInput) {
        return new Post(
            null,
            data.title,
            data.content,
            data.isPublished,
            null,
            data.authorId,
        );
    };

    static reconstitute(data: PostDTO): Post {
        return new Post(
            data.id,
            data.title,
            data.content,
            data.isPublished,
            data.createdAt,
            data.authorId,
        );
    }

}