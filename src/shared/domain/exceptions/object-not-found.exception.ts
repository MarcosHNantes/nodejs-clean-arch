import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "./application-error"

export class ObjectNotFoundException extends ApplicationError {
    constructor(message = "Object not found!", code = StatusCodes.BAD_REQUEST) {
        super(message, code)
    }
}
