import { ConditionalOperator } from "@/shared/domain"

export const POSTGRES_DELETE_STATEMENT_KEY = "PostgresDeleteStatementInterface"

export interface PostgresDeleteStatementInterface {
    from: (targetTable: string) => this

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

    delete: (shouldReturnDeletedObject?: boolean) => Promise<boolean | any>

    deleteOrFail: (
        shouldReturnDeletedObject?: boolean,
    ) => Promise<boolean | any>
}
