import { authRoutesHandler } from "@/auth"
import { usersRoutesHandler } from "@/users"
import express from "express"

export const routes: express.Router = express.Router()

routes.use("/auth", authRoutesHandler)
routes.use("/users", usersRoutesHandler)
