import dotenv from "dotenv"

dotenv.config()

export const envVariablesContainer = {
    environment: process.env.ENVIRONMENT,
    postgresDatabaseConfig: {
        host: process.env.POSTGRES_DATABASE_HOST,
        port: Number(process.env.POSTGRES_DATABASE_PORT) ?? 5432,
        user: process.env.POSTGRES_DATABASE_USERNAME,
        password: process.env.POSTGRES_DATABASE_PASSWORD,
        database: process.env.POSTGRES_DATABASE_DBNAME,
    },
    cipher: {
        secret: process.env.CIPHER_SECRET_KEY,
    },
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
    },
}
