import "reflect-metadata"
import { envVariablesContainer, routes } from "config"
import cors from "cors"
import express from "express"
import { Pool } from "pg"

const APPLICATION_PORT = process.env.APPLICATION_PORT

const app: express.Express = express()

app.use(cors())
app.use(express.json())
app.use(routes)

export const databaseInstance = new Pool({
    ...envVariablesContainer.postgresDatabaseConfig,
})

const applicationPort = APPLICATION_PORT || 8080

app.listen(applicationPort, () => {
    console.log(`Server running on port ${applicationPort}`)
})

export default app
