import { SQLException } from "@/shared/domain"
import { autoInjectable, inject } from "tsyringe"
import {
    InsertValues,
    POSTGRES_DATABASE_DRIVER_KEY,
    PostgresDatabaseDriverInterface,
    PostgresInsertStatementInterface,
} from "../../contracts"

@autoInjectable()
export class PostgresInsert implements PostgresInsertStatementInterface {
    private targetTable = ""
    private insertValues: InsertValues[]

    constructor(
        @inject(POSTGRES_DATABASE_DRIVER_KEY)
        private readonly databaseDriver: PostgresDatabaseDriverInterface,
    ) {}

    public into(targetTable: string) {
        this.targetTable = targetTable
        return this
    }

    public values(valuesArray: InsertValues[]) {
        const validValues = this.handleUndefinedValues(valuesArray)
        this.insertValues = validValues
        return this
    }

    public async insert() {
        const query = this.prepareSQL()

        const result = await this.databaseDriver.executeSQL(query)

        if (!result) {
            throw new SQLException("Could not insert the record!")
        }

        return result[0]
    }

    private prepareSQL(): string {
        let query: string

        query = `INSERT INTO ${this.targetTable} (`

        this.insertValues.forEach((singleInsertValue, index) => {
            if (index === this.insertValues.length - 1) {
                query = query + `${singleInsertValue.column}) VALUES (`
                return query
            }

            query = query + `${singleInsertValue.column}, `
        })

        this.insertValues.forEach((singleInsertValue, index) => {
            const value = singleInsertValue.value

            if (index === this.insertValues.length - 1) {
                query = query + `${value})`
                return query
            }

            query = query + `${value}, `
        })

        query = query + " RETURNING * "

        return query
    }

    private handleUndefinedValues(values: InsertValues[]): InsertValues[] {
        const validValues: InsertValues[] = []

        values.forEach(insertValue => {
            if (insertValue.value === undefined) {
                return
            }

            insertValue.value = this.prepareStringField(insertValue.value)

            validValues.push(insertValue)
        })

        return validValues
    }

    private prepareStringField(field: any): string {
        if (typeof field === "string") {
            const valueWithoutQuotes = field.replace(/'/g, "")
            return `'${valueWithoutQuotes}'`
        }

        return field
    }
}
