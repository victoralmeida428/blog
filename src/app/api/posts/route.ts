import {PrismaPostRepository} from "@/app/api/repository/PrismaPostRepository";
import {PostService} from "@/app/api/services/PostService";
import {PostController} from "@/app/api/controller/PostController";
import {NextRequest} from "next/server";

const postRepository = new PrismaPostRepository();
const postService = new PostService(postRepository);
const controller = new PostController(postService);

export async function GET() {
    return controller.listPosts();
}

export async function POST(request: NextRequest) {
    return controller.createPost(request);
}