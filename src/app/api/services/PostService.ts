import {Post, PostCreateInput, PostDTO} from "@/app/api/dominio/Post";
import {IPostRepository} from "@/app/api/repository/IPostRepository";
import {NotFoundError} from "@/app/api/errors/NotFoundError";
import {NoContentError} from "@/app/api/errors/NoContentError";

export class PostService {
    constructor(
        private readonly postRepository: IPostRepository,
    ) {
    }

    async createPost(data: PostCreateInput): Promise<Post> {
        if (data.title == '') throw new Error("title is required");
        const newPost = Post.create(data)
        return await this.postRepository.create(newPost);
    }

    async searchPost(id: number): Promise<Post | null> {
        if (id <= 0) throw new Error("id is required");
        return await this.postRepository.findById(id);
    }

    async ListPost(): Promise<Post[]> {
        const posts = await this.postRepository.findAll();
        if (posts.length <= 0) throw new NoContentError()
        return posts;
    }

    async updatePost(id: number, data: Partial<PostDTO>): Promise<void> {
        if (data.title == '') throw new Error("title is required");
        const existingPost = await this.postRepository.findById(id);

        if (!existingPost) throw new NotFoundError("Post");

        existingPost.title = data.title ?? existingPost.title;
        existingPost.content = data.content ?? existingPost.content;

        if (data.isPublished !== undefined && data.isPublished !== null) {
            if (data.isPublished) {
                existingPost.publish(); // Usa o método de domínio para publicar
            }
        }
        await this.postRepository.update(existingPost);
    }

    async deletePost(id: number): Promise<void> {
        const existingPost = await this.postRepository.findById(id);
        if (!existingPost) throw new NotFoundError("Post");
        await this.postRepository.delete(id);
    }


}