import {
    JWT_KEY,
    JwtToken,
    Pagination,
    PAGINATION_KEY,
    POSTGRES_DATABASE_DRIVER_KEY,
    POSTGRES_DELETE_STATEMENT_KEY,
    POSTGRES_INSERT_STATEMENT_KEY,
    POSTGRES_SELECT_STATEMENT_KEY,
    POSTGRES_UPDATE_STATEMENT_KEY,
    PostgresDelete,
    PostgresDriver,
    PostgresInsert,
    PostgresSelect,
    PostgresUpdate,
    USERS_REPOSITORY_KEY,
    UsersRepository,
} from "@/shared"
import { container } from "tsyringe"

/* DATABASES */
container.register(POSTGRES_DATABASE_DRIVER_KEY, {
    useClass: PostgresDriver,
})

/* STATEMENTS */
container.register(POSTGRES_SELECT_STATEMENT_KEY, {
    useClass: PostgresSelect,
})
container.register(POSTGRES_INSERT_STATEMENT_KEY, {
    useClass: PostgresInsert,
})
container.register(POSTGRES_UPDATE_STATEMENT_KEY, {
    useClass: PostgresUpdate,
})
container.register(POSTGRES_DELETE_STATEMENT_KEY, {
    useClass: PostgresDelete,
})

/* INFRA */
container.register(PAGINATION_KEY, {
    useClass: Pagination,
})
container.register(JWT_KEY, {
    useClass: JwtToken,
})

/* REPOSITORIES */
container.register(USERS_REPOSITORY_KEY, {
    useClass: UsersRepository,
})

export default container
