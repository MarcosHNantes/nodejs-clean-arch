import { PostgresDatabaseDriverInterface } from "@/shared/adapters"
import { SQLException } from "@/shared/domain"
import { StatusCodes } from "http-status-codes"
import { Pool } from "pg"
import { databaseInstance } from "src/main"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export class PostgresDriver implements PostgresDatabaseDriverInterface {
    protected databaseInstance: Pool

    constructor() {
        this.databaseInstance = databaseInstance
    }

    public async executeSQL(
        sql: string,
        bindParams?: Array<any>,
    ): Promise<any> {
        try {
            const { rows } = await this.databaseInstance.query(sql, bindParams)

            return rows
        } catch (error) {
            throw new SQLException(
                `Error executing SQL!`,
                StatusCodes.INTERNAL_SERVER_ERROR,
                error,
            )
        }
    }

    public async beginTransaction() {
        await this.databaseInstance.query("BEGIN")
    }

    public async commitTransaction() {
        await this.databaseInstance.query("COMMIT")
    }

    public async rollbackTransaction() {
        await this.databaseInstance.query("ROLLBACK")
    }

    public async closeConnection(): Promise<void> {
        this.databaseInstance.end()
    }
}
