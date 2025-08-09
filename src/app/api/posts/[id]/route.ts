import {PrismaPostRepository} from "@/app/api/repository/PrismaPostRepository";
import {PostService} from "@/app/api/services/PostService";
import {NextRequest} from "next/server";
import {PostController} from "@/app/api/controller/PostController";
import {RouteContext} from "@/app/api/controller/AbsctractController";


const postRepository = new PrismaPostRepository();
const postService = new PostService(postRepository);
const controller = new PostController(postService);

export async function GET(request: NextRequest, context: RouteContext) {
    return controller.getById(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    return controller.deletePost(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
    return controller.updatePost(request, context);
}