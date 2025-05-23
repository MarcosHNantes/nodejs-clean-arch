import { CreateUserDto, User } from "@/shared/domain"

export const USERS_REPOSITORY_KEY = "UsersRepositoryInterface"

export interface UsersRepositoryInterface {
    findByEmailOrUsername(emailOrUsername: string): Promise<User | null>
    create(data: CreateUserDto): Promise<User>
    // update(id: string, data: UpdateUserDTO): Promise<User | null>;
    // delete(id: string): Promise<void>;
}
