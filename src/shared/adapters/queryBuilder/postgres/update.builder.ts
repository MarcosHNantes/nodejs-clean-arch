import {
    ConditionalOperator,
    ObjectNotFoundException,
    SQLException,
} from "@/shared/domain"
import { autoInjectable, inject } from "tsyringe"
import {
    POSTGRES_DATABASE_DRIVER_KEY,
    PostgresDatabaseDriverInterface,
    PostgresUpdateStatementInterface,
    UpdateValues,
} from "../../contracts"

@autoInjectable()
export class PostgresUpdate implements PostgresUpdateStatementInterface {
    private targetTable: string = ""
    private valuesArray: UpdateValues[] = []
    private whereConditions: Array<unknown> = []

    constructor(
        @inject(POSTGRES_DATABASE_DRIVER_KEY)
        private readonly databaseDriver: PostgresDatabaseDriverInterface,
    ) {}

    public table(targetTable: string) {
        this.targetTable = targetTable
        return this
    }

    public values(valuesArray: UpdateValues[]) {
        const correctedValues = this.handleUndefinedValues(valuesArray)
        this.valuesArray = correctedValues
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

    public async update(): Promise<any> {
        const query = this.prepareQuery()

        const recordExists = await this.checkIfRecordExists()

        if (!recordExists) {
            throw new ObjectNotFoundException()
        }

        const result = await this.databaseDriver.executeSQL(query)

        if (!result || result.length <= 0) {
            throw new SQLException("Could not update the record!")
        }

        return result[0]
    }

    private async checkIfRecordExists(): Promise<boolean> {
        let query = `SELECT * FROM ${this.targetTable} `

        this.whereConditions.forEach(value => {
            query = query + value
        })

        const result = await this.databaseDriver.executeSQL(query)

        if (!result || result.length <= 0) {
            return false
        }

        return true
    }

    private addConditionToQuery(
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ): void {
        const newValue = this.prepareStringField(value)
        this.whereConditions.push(
            `${column} ${conditionalOperator} ${newValue}`,
        )
    }

    private prepareQuery(): string {
        let query: string

        query = `UPDATE ${this.targetTable} SET `

        this.valuesArray.forEach((updateValue, index) => {
            const value = updateValue.value

            if (index === this.valuesArray.length - 1) {
                query = query + `${updateValue.column} = ${value} `
                return query
            }

            query = query + `${updateValue.column} = ${value}, `
        })

        this.whereConditions.forEach(value => {
            query = query + value
        })

        query = query + " RETURNING * "

        return query
    }

    private handleUndefinedValues(values: UpdateValues[]): UpdateValues[] {
        const correctValues: UpdateValues[] = []

        values.forEach(updateValue => {
            if (!updateValue.value) {
                return
            }

            updateValue.value = this.prepareStringField(updateValue.value)

            correctValues.push(updateValue)
        })

        return correctValues
    }

    private prepareStringField(field: any): string {
        if (typeof field === "string") {
            const valueWithoutQuotes = field.replace(/'/g, "")
            return `'${valueWithoutQuotes}'`
        }

        return field
    }
}
