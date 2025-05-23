import { ConditionalOperator } from "@/shared/domain"
import { PaginatedResult } from "../../pagination.interface"

export const POSTGRES_SELECT_STATEMENT_KEY = "PostgresSelectStatementInterface"

export interface PostgresSelectStatementInterface {
    select: (columns?: string) => this

    from: (tableName: string, alias?: string) => this

    leftJoin: (tableName: string, alias: string, comparator: string) => this

    innerJoin: (tableName: string, alias: string, comparator: string) => this

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

    orderBy: (field: string, sortType?: SortType) => this

    addOrderBy: (field: string, sortType?: SortType) => this

    groupBy: (column: string) => this

    addGroupBy: (column: string) => this

    limit: (limit: number, secondLimit?: number) => this

    offset: (offset: number) => this

    fetchOne: () => Promise<any>

    fetchOneOrFail: () => Promise<any>

    fetchAll: () => Promise<any[]>

    fetchAllAndPaginate: (
        currentPage: number,
        recordsPerPage?: number,
    ) => Promise<PaginatedResult<any>>

    fetchAllOrFail: () => Promise<any[]>
}

export type SortType = "ASC" | "DESC"
