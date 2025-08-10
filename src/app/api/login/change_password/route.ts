import {PrismaUserRepository} from "@/app/api/repository/PrismaUserRepository";
import {UserService} from "@/app/api/services/UserSevice";
import {AuthService} from "@/app/api/services/AuthServer";
import {PrismaSessionRepository} from "@/app/api/repository/PrismaSessionRepository";
import {UserController} from "@/app/api/controller/UserController";
import {NextRequest} from "next/server";

const userRepository = new PrismaUserRepository();
const sessionRepository = new PrismaSessionRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, sessionRepository);
const controller = new UserController(userService, authService);

export async function POST(request: NextRequest) {
    return controller.changePassword(request);
}