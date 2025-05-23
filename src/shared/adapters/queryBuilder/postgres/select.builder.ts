import {
    ApplicationError,
    ConditionalOperator,
    ObjectNotFoundException,
    OrderType,
    SQLException,
} from "@/shared/domain"
import { autoInjectable, inject } from "tsyringe"
import {
    PAGINATION_KEY,
    PaginationInterface,
    POSTGRES_DATABASE_DRIVER_KEY,
    PostgresDatabaseDriverInterface,
    PostgresSelectStatementInterface,
} from "../../contracts"

@autoInjectable()
export class PostgresSelect implements PostgresSelectStatementInterface {
    private selectColumns: string = ""
    private targetTable: string = ""
    private joinTables: Array<string> = []
    private whereConditions: Array<unknown> = []
    private orderByRules: Array<string> = []
    private groupByRules: Array<string> = []
    private definedLimit: number
    private secondDefinedLimit: number
    private definedOffset: number

    constructor(
        @inject(POSTGRES_DATABASE_DRIVER_KEY)
        private readonly databaseDriver: PostgresDatabaseDriverInterface,
        @inject(PAGINATION_KEY)
        private readonly pagination: PaginationInterface,
    ) {}

    public select(columns = "*") {
        this.selectColumns = `SELECT ${columns}`
        return this
    }

    public from(targetTable: string, alias: string = "") {
        this.targetTable = `${targetTable} ${alias}`
        return this
    }

    public leftJoin(joinTable: string, alias: string, joinComparator: string) {
        const renamedTable = alias ?? ""
        this.joinTables.push(
            ` LEFT JOIN ${joinTable} ${renamedTable} ON ${joinComparator} `,
        )
        return this
    }

    public innerJoin(joinTable: string, alias: string, joinComparator: string) {
        const renamedTable = alias ?? ""
        this.joinTables.push(
            ` INNER JOIN ${joinTable} ${renamedTable} ON ${joinComparator} `,
        )
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

    public orderBy(field: string, orderType: OrderType = "ASC") {
        this.addOrderByToQuery(field, orderType)
        return this
    }

    public addOrderBy(field: string, orderType: OrderType = "ASC") {
        this.addOrderByToQuery(field, orderType)
        return this
    }

    public groupBy(column: string) {
        this.addGroupByToQuery(column)
        return this
    }

    public addGroupBy(column: string) {
        this.addGroupByToQuery(column)
        return this
    }

    public limit(limitResults: number, secondLimit?: number) {
        this.definedLimit = limitResults
        this.secondDefinedLimit = secondLimit
        return this
    }

    public offset(offsetResults: number) {
        this.definedOffset = offsetResults
        return this
    }

    public async fetchOne(): Promise<any> {
        this.definedLimit = 1
        const sql = this.buildSQL()

        const result = await this.databaseDriver.executeSQL(sql, [])

        if (!result) {
            return null
        }

        return result[0]
    }

    public async fetchOneOrFail(): Promise<any> {
        this.definedLimit = 1
        const sql = this.buildSQL()

        const result = await this.databaseDriver.executeSQL(sql, [])

        if (!result || result.length <= 0) {
            throw new ObjectNotFoundException()
        }

        return result[0]
    }

    public async fetchAll(): Promise<Array<any>> {
        const sql = this.buildSQL()

        const result = await this.databaseDriver.executeSQL(sql, [])

        if (!result) {
            return []
        }

        return result
    }

    public async fetchAllAndPaginate(
        currentPage = 1,
        recordsPerPage = 20,
    ): Promise<any> {
        const paginationData = await this.getPaginationData(
            currentPage,
            recordsPerPage,
        )

        this.definedLimit = recordsPerPage
        this.definedOffset = (currentPage - 1) * recordsPerPage

        const sql = this.buildSQL()

        const result = await this.databaseDriver.executeSQL(sql, [])

        if (!result) {
            return []
        }

        return {
            data: result,
            info: paginationData,
        }
    }

    public async fetchAllOrFail(): Promise<any[]> {
        const sql = this.buildSQL()

        const result = await this.databaseDriver.executeSQL(sql, [])

        if (!result) {
            throw new SQLException("No records found!")
        }

        return result
    }

    private async getPaginationData(
        currentPage: number,
        recordsPerPage?: number,
    ) {
        let query = `SELECT COUNT(*) AS total FROM ${this.targetTable} `

        this.whereConditions.forEach(value => {
            if (value) {
                query = query + value
            }
        })

        const result = await this.databaseDriver.executeSQL(query)

        return this.pagination.getDataToPagination(
            currentPage,
            result[0].total,
            recordsPerPage,
        )
    }

    private addConditionToQuery(
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ): void {
        const hasIsConditions =
            conditionalOperator === "IS" || conditionalOperator === "IS NOT"
        const hasLikeCondition = conditionalOperator === "ILIKE"

        if ((!hasIsConditions && !value) || value === "undefined") {
            return
        }

        const newValue = this.prepareField(value, hasLikeCondition)

        this.whereConditions.push(
            ` ${column} ${conditionalOperator} ${newValue} `,
        )
    }

    private addOrderByToQuery(column: string, type: OrderType) {
        const orderByContent = ` ORDER BY ${column} ${type} `

        if (this.orderByRules.length > 0) {
            this.orderByRules.push(`${orderByContent},`)
        }

        this.orderByRules.push(orderByContent)
    }

    private addGroupByToQuery(column: string) {
        const groupByContent = `${column}`

        if (this.orderByRules.length > 0) {
            this.orderByRules.push(`${groupByContent},`)
        }

        this.orderByRules.push(groupByContent)
    }

    private buildSQL(): string {
        let query: string

        this.validateQueryArguments()

        query = `${this.selectColumns} FROM ${this.targetTable} `

        this.joinTables.forEach(joinExpression => {
            query = query + joinExpression
        })

        this.whereConditions.forEach(whereExpression => {
            query = query + whereExpression
        })

        this.orderByRules.forEach(orderByExpression => {
            query = query + orderByExpression
        })

        this.groupByRules.forEach(groupByExpression => {
            query = query + groupByExpression
        })

        const primaryLimit = !isNaN(this.definedLimit) ? this.definedLimit : ""
        const secondaryLimit = !isNaN(this.secondDefinedLimit)
            ? `, ${this.secondDefinedLimit} `
            : ""

        query = primaryLimit
            ? query + ` LIMIT ${primaryLimit} ${secondaryLimit} `
            : query
        query = this.definedOffset
            ? query + ` OFFSET ${this.definedOffset} `
            : query

        return query
    }

    private prepareField(field: any, hasLikeExpression?: boolean): string {
        if (typeof field === "string") {
            const valueWithoutQuotes = field.replace(/'/g, "")
            return hasLikeExpression
                ? `'%${valueWithoutQuotes}%'`
                : `'${valueWithoutQuotes}'`
        }

        return field
    }

    private validateQueryArguments(): void {
        if (!this.selectColumns) {
            throw new ApplicationError("SELECT reference cannot be empty!")
        }

        if (!this.targetTable) {
            throw new ApplicationError("FROM reference cannot be empty!")
        }
    }
}
