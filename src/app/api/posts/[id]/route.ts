import {PrismaPostRepository} from "@/app/api/repository/PrismaPostRepository";
import {PostService} from "@/app/api/services/PostService";
import {NextRequest} from "next/server";
import {PostController} from "@/app/api/controller/PostController";
import {RouteContext} from "@/app/api/controller/AbsctractController";
import {PrismaUserRepository} from "@/app/api/repository/PrismaUserRepository";
import {UserService} from "@/app/api/services/UserSevice";


const postRepository = new PrismaPostRepository();
const postService = new PostService(postRepository);
const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const controller = new PostController(postService, userService);

export async function GET(request: NextRequest, context: RouteContext) {
    return controller.getById(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    return controller.deletePost(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
    return controller.updatePost(request, context);
}