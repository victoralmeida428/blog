import {PrismaPostRepository} from "@/app/api/repository/PrismaPostRepository";
import {PostService} from "@/app/api/services/PostService";
import {PostController} from "@/app/api/controller/PostController";
import {NextRequest} from "next/server";
import {UserService} from "@/app/api/services/UserSevice";
import {PrismaUserRepository} from "@/app/api/repository/PrismaUserRepository";

const postRepository = new PrismaPostRepository();
const postService = new PostService(postRepository);
const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const controller = new PostController(postService, userService);

export async function GET() {
    return controller.listPosts();
}

export async function POST(request: NextRequest) {
    return controller.createPost(request);
}