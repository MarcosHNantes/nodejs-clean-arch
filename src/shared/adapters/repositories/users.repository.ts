import { CreateUserDto, User, UserFactory } from "@/shared/domain"
import { autoInjectable } from "tsyringe"
import { UsersRepositoryInterface } from "../contracts"
import { PostgresRepository } from "./base"

@autoInjectable()
export class UsersRepository
    extends PostgresRepository
    implements UsersRepositoryInterface
{
    constructor() {
        super()
    }

    async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
        const result = await this.postgresSelect
            .select("*")
            .from("users")
            .where("username", "=", emailOrUsername)
            .orWhere("email", "=", emailOrUsername)
            .fetchOne()

        if (!result) {
            return null
        }

        return UserFactory.create(result)
    }

    async create(data: CreateUserDto): Promise<User> {
        const result = await this.postgresInsert
            .into("users")
            .values([
                { column: "uuid", value: data.uuid },
                { column: "username", value: data.username },
                { column: "email", value: data.email },
                { column: "password", value: data.password },
            ])
            .insert()

        return UserFactory.create(result)
    }
}
