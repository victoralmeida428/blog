import {Post} from "@/app/api/dominio/Post";


export interface IPostRepository {
    create (post: Post): Promise<Post>;
    findById(id: number): Promise<Post|null>;
    findAll(): Promise<Post[]>;
    update(post: Post): Promise<void>;
    delete(id: number): Promise<void>;
}