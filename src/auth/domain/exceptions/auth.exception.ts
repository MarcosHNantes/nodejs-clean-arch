import { ApplicationError } from "@/shared"
import { StatusCodes } from "http-status-codes"

export class AuthException extends ApplicationError {
    constructor(
        message = "An error ocorrued while processing the authorization request!",
        code = StatusCodes.INTERNAL_SERVER_ERROR,
    ) {
        super(message, code)
    }
}
