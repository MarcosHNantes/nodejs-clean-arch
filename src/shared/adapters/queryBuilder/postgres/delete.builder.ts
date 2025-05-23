import { ConditionalOperator, SQLException } from "@/shared/domain"
import { StatusCodes } from "http-status-codes"
import { autoInjectable, inject } from "tsyringe"
import {
    POSTGRES_DATABASE_DRIVER_KEY,
    PostgresDatabaseDriverInterface,
    PostgresDeleteStatementInterface,
} from "../../contracts"

@autoInjectable()
export class PostgresDelete implements PostgresDeleteStatementInterface {
    private targetTable: string = ""
    private whereConditions: Array<unknown> = []

    constructor(
        @inject(POSTGRES_DATABASE_DRIVER_KEY)
        private readonly databaseDriver: PostgresDatabaseDriverInterface,
    ) {}

    public from(targetTable: string) {
        this.targetTable = targetTable
        return this
    }

    public where(
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) {
        this.addConditionToQuery(`WHERE ${column} `, conditionalOperator, value)
        return this
    }

    public andWhere(
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) {
        this.addConditionToQuery(`AND ${column}`, conditionalOperator, value)
        return this
    }

    public orWhere(
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) {
        this.addConditionToQuery(`OR ${column}`, conditionalOperator, value)
        return this
    }

    public addOrWhere(
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) {
        this.addConditionToQuery(`OR ${column}`, conditionalOperator, value)
        return this
    }

    public async delete(
        shouldReturnDeletedObject: boolean = false,
    ): Promise<boolean | any> {
        const query = this.prepareSQLQuery()
        const result = await this.databaseDriver.executeSQL(query)
        return shouldReturnDeletedObject ? result : Boolean(result.length > 0)
    }

    public async deleteOrFail(
        shouldReturnDeletedObject: boolean = false,
    ): Promise<boolean | any> {
        const query = this.prepareSQLQuery()
        const result = await this.databaseDriver.executeSQL(query)

        if (!result || result.length <= 0) {
            throw new SQLException(
                "Could not delete the record!",
                StatusCodes.UNPROCESSABLE_ENTITY,
            )
        }

        return shouldReturnDeletedObject ? result : true
    }

    private addConditionToQuery(
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ): void {
        const newFieldValue = this.prepareField(value)
        this.whereConditions.push(
            `${column} ${conditionalOperator} ${newFieldValue}`,
        )
    }

    private prepareSQLQuery(): string {
        let query: string

        query = `DELETE FROM ${this.targetTable} `

        this.whereConditions.forEach(value => {
            query = query + value
        })

        query = query + " RETURNING * "

        return query
    }

    private prepareField(field: any): string {
        if (typeof field === "string") {
            const valueWithoutQuotes = field.replace(/'/g, "")
            return `'${valueWithoutQuotes}'`
        }

        return field
    }
}
