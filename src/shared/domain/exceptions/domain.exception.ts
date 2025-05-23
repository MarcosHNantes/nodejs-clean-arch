import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "./application-error"

export class DomainException extends ApplicationError {
    constructor(
        message = "Unexpected domain exception!",
        code = StatusCodes.INTERNAL_SERVER_ERROR,
    ) {
        super(message, code)
    }
}
