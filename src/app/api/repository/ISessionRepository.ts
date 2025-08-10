import {Session, SessionDTO} from "@/app/api/dominio/Session";

export interface ISessionRepository {
    create(session: SessionDTO): Promise<Session>

    delete(id: string): Promise<void>

    findById(id: string): Promise<Session>
}