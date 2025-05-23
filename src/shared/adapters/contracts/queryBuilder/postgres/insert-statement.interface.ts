export const POSTGRES_INSERT_STATEMENT_KEY = "PostgresInsertStatementInterface"

export interface PostgresInsertStatementInterface {
    into: (targetTable: string) => this
    values: (valueArray: InsertValues[]) => this
    insert: () => Promise<any>
}

export type InsertValues = {
    column: string
    value: any
}
