import { autoInjectable, inject } from "tsyringe"
import {
    POSTGRES_DATABASE_DRIVER_KEY,
    POSTGRES_DELETE_STATEMENT_KEY,
    POSTGRES_INSERT_STATEMENT_KEY,
    POSTGRES_SELECT_STATEMENT_KEY,
    POSTGRES_UPDATE_STATEMENT_KEY,
    PostgresDatabaseDriverInterface,
    PostgresDeleteStatementInterface,
    PostgresInsertStatementInterface,
    PostgresSelectStatementInterface,
    PostgresUpdateStatementInterface,
} from "../../contracts"
import { BaseRepository } from "./base-repository.repository"

@autoInjectable()
export class PostgresRepository extends BaseRepository {
    constructor(
        @inject(POSTGRES_INSERT_STATEMENT_KEY)
        protected readonly postgresInsert?: PostgresInsertStatementInterface,

        @inject(POSTGRES_SELECT_STATEMENT_KEY)
        protected readonly postgresSelect?: PostgresSelectStatementInterface,

        @inject(POSTGRES_UPDATE_STATEMENT_KEY)
        protected readonly postgresUpdate?: PostgresUpdateStatementInterface,

        @inject(POSTGRES_DELETE_STATEMENT_KEY)
        protected readonly postgresDelete?: PostgresDeleteStatementInterface,

        @inject(POSTGRES_DATABASE_DRIVER_KEY)
        protected readonly postgresDatabaseDriver?: PostgresDatabaseDriverInterface,
    ) {
        super()
    }
}
