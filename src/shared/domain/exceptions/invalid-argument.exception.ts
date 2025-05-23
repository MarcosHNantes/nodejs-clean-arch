import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "./application-error"

export class InvalidArgumentException extends ApplicationError {
    constructor(
        message = "Argument out of range!",
        code = StatusCodes.BAD_REQUEST,
    ) {
        super(message, code)
    }
}
