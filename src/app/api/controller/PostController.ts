import {NextRequest, NextResponse} from "next/server";
import {Prisma} from "@/generated/prisma";
import {AbstractController, RouteContext} from "@/app/api/controller/AbsctractController";
import {PostService} from "@/app/api/services/PostService";
import {PostCreateInput} from "@/app/api/dominio/Post";
import PostUpdateInput = Prisma.PostUpdateInput;

export class PostController extends AbstractController {

    constructor(private readonly postService: PostService) {
        super();
    }

    /**
     * GET /api/posts/{id}
     * @param request
     * @param context
     */
    async getById(request: NextRequest, context: RouteContext) {
        try {
            const id = await this.getID(context);
            const post = await this.postService.searchPost(id);

            if (!post) {
                return new NextResponse("Post not found", {status: 404});
            }

            return NextResponse.json(post);
        } catch (error) {
            return this.handlerError(error);
        }
    }

    /**
     *  Atualiza o post
     *  POST /api/posts
     * @param request
     * @param context
     */
    async updatePost(request: NextRequest, context: RouteContext) {
        try {
            const body = await request.json() as PostUpdateInput;
            const id = await this.getID(context);
            await this.postService.updatePost(id, body);
            return new NextResponse("post updated successfully");

        } catch (error) {
            return this.handlerError(error);
        }
    }

    /**
     * Deleta o post baseado no ID
     * DELET /api/posts/{id}
     * @param request
     * @param context
     */
    async deletePost(request: NextRequest, context: RouteContext) {
        try {
            const id = await this.getID(context);
            await this.postService.deletePost(id);
            return new NextResponse("post deleted successfully");
        } catch (error) {
            return this.handlerError(error);
        }

    }

    /**
     * Lista todos os posts do banco
     * GET /api/posts
     */
    async listPosts() {
        try {
            const posts = await this.postService.ListPost();
            return NextResponse.json(posts.map((post) => {
                return {
                    id: post.id,
                    title: post.title,
                    content: post.excertpt,
                    createdAt: post.createdAt,
                    isPulished: post.isPublished(),
                    authorId: post.authorId
                };
            }));
        } catch
            (error) {
            return this.handlerError(error);
        }
    }

    async createPost(request: NextRequest) {
        try {
            const body = await request.json() as PostCreateInput;
            const newPost = await this.postService.createPost(body);
            return NextResponse.json(newPost, {status: 201});

        } catch (error) {
            this.handlerError(error);
        }
    }
}
