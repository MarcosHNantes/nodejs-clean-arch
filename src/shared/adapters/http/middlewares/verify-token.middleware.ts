import { verifyJWTToken } from "@/shared/helpers"
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

type DecodedToken = {
    id: number
    name: string
    iat: number
    exp: number
}

export interface GenericRequest extends Request {
    decodedToken: DecodedToken
}

export function verifyUserAuthentication(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const token = request.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: "You are not authorized to perform this action!",
        })
    }

    const validToken = verifyJWTToken(token)

    if (!validToken) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid token!",
        })
    }

    ;(request as GenericRequest).decodedToken = validToken

    return next()
}
