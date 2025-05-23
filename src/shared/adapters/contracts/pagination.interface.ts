export const PAGINATION_KEY = "PaginationInterface"

export interface PaginationInterface {
    getDataToPagination: (
        currentPage: number,
        totalRecords: number,
        resultsPerPage?: number,
    ) => PaginationData
}

export interface PaginationData {
    currentPage: number
    start: number
    end: number
    totalPages: number
    totalRecords: number
}

export interface PaginatedResult<T> {
    data: T[]
    infos: PaginationData
}
