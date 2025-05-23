import { Action } from "@/shared"
import { CreateUserAction } from "./actions"

const usersRoutes = new Action()

usersRoutes.post("", CreateUserAction)

export const usersRoutesHandler = usersRoutes.routes()
