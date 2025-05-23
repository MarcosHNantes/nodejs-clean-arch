import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "./application-error"

export class RuntimeException extends ApplicationError {
    constructor(
        message = "Unable to process requested content!",
        code = StatusCodes.INTERNAL_SERVER_ERROR,
    ) {
        super(message, code)
    }
}
