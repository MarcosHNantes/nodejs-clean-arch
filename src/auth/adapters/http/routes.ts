import { Action } from "@/shared"
import { LoginAction } from "./actions"

const authRoutes = new Action()

authRoutes.post("/login", LoginAction)

export const authRoutesHandler = authRoutes.routes()
