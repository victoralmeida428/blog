import {User} from "@/app/api/dominio/User";

export type PostDTO = {
    id: number,
    title: string,
    content: string | null,
    isPublished: boolean,
    createdAt: Date,
    authorId: number,
    author: User | null,
}

export type PostCreateInput = {
    title: string,
    content: string | null,
    isPublished: boolean,
    authorId: number,
}

export class Post {
    public author: User | null = null;

    constructor(
        public readonly id: number | null,
        public title: string,
        public content: string | null,
        private _isPublished: boolean,
        public readonly createdAt: Date | null,
        public readonly authorId: number,
    ) {
    }

    get excerpt(): string {
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
        const post = new Post(
            data.id,
            data.title,
            data.content,
            data.isPublished,
            data.createdAt,
            data.authorId,
        );

        if (data.author) {
            post.author = data.author;
        }

        return post;
    }

}