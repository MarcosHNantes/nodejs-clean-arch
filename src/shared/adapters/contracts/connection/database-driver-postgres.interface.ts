export const POSTGRES_DATABASE_DRIVER_KEY = "PostgresDatabaseDriverInterface"

export interface PostgresDatabaseDriverInterface {
    executeSQL: (sql: string, params?: Array<any>) => Promise<any>
    beginTransaction: () => Promise<void>
    commitTransaction: () => void
    rollbackTransaction: () => void
    closeConnection: () => void
}
