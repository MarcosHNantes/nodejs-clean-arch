import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "./application-error"

export class FactoryException extends ApplicationError {
    constructor(
        message = "An error occurred while creating the object!",
        code = StatusCodes.INTERNAL_SERVER_ERROR,
    ) {
        super(message, code)
    }
}
