export const POSTGRES_UPDATE_STATEMENT_KEY = "PostgresUpdateStatementInterface"

export interface PostgresUpdateStatementInterface {
    table: (targetTable: string) => this

    values: (valueArray: UpdateValues[]) => this

    where: (
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) => this

    andWhere: (
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) => this

    orWhere: (
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) => this

    addOrWhere: (
        column: string,
        conditionalOperator: ConditionalOperator,
        value: unknown,
    ) => this

    update: () => Promise<any>
}

export type UpdateValues = {
    column: string
    value: any
}
type ConditionalOperator = "=" | "<>" | "!=="
