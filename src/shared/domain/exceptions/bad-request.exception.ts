import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "./application-error"

export class BadRequestException extends ApplicationError {
    constructor(
        message = "Invalid parameters!",
        code = StatusCodes.BAD_REQUEST,
    ) {
        super(message, code)
    }
}
