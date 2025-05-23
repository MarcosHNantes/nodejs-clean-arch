import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "./application-error"

export class UnauthorizedException extends ApplicationError {
    constructor(
        message = "Unauthorized user!",
        code = StatusCodes.UNAUTHORIZED,
    ) {
        super(message, code)
    }
}
