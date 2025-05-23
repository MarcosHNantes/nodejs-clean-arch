import {
    ApplicationError,
    BadRequestException,
    SQLException,
} from "@/shared/domain"
import { toSnakeCase } from "@/shared/helpers"
import container from "config/injection-container.config"
import { Response, Router } from "express"
import { StatusCodes } from "http-status-codes"
import { InjectionToken, injectable } from "tsyringe"

@injectable()
export class Action {
    private readonly router: Router

    constructor() {
        const expressRouter = Router()
        this.router = expressRouter
    }

    public routes(): Router {
        return this.router
    }

    public async get(endpoint: string, action: InjectionToken<any>) {
        const currentActionInstance = this

        this.router.get(endpoint, async (request, response, next) => {
            try {
                const actionResponse = await container
                    .resolve(action)
                    .handle(request)
                return response.json({
                    data: actionResponse,
                })
            } catch (error) {
                return currentActionInstance.respondWithError(response, error)
            }
        })
    }

    public async post(endpoint: string, action: InjectionToken<any>) {
        const currentActionInstance = this

        this.router.post(endpoint, async (request, response, next) => {
            try {
                const actionResponse = await container
                    .resolve(action)
                    .handle(request)
                const convertedActionResponse =
                    this.transformOutputToSnakeCase(actionResponse)

                return response.json({
                    data: convertedActionResponse,
                })
            } catch (error) {
                return currentActionInstance.respondWithError(response, error)
            }
        })
    }

    public async put(endpoint: string, action: InjectionToken<any>) {
        const currentActionInstance = this

        this.router.put(endpoint, async (request, response, next) => {
            try {
                const actionResponse = await container
                    .resolve(action)
                    .handle(request)
                return response.json({
                    data: actionResponse,
                })
            } catch (error) {
                return currentActionInstance.respondWithError(response, error)
            }
        })
    }

    public async delete(endpoint: string, action: InjectionToken<any>) {
        const currentActionInstance = this

        this.router.delete(endpoint, async (request, response, next) => {
            try {
                const actionResponse = await container
                    .resolve(action)
                    .handle(request)
                return response.json({
                    data: actionResponse,
                })
            } catch (error) {
                return currentActionInstance.respondWithError(response, error)
            }
        })
    }

    private respondWithError(response: Response, thrownError: any) {
        if (thrownError instanceof BadRequestException) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                status: "Invalid request!",
                message: JSON.parse(JSON.stringify(thrownError.message)),
            })
        }

        if (thrownError instanceof ApplicationError) {
            return response.status(thrownError.statusCode).json({
                message: thrownError.message,
            })
        }

        if (thrownError instanceof SQLException) {
            return response.status(thrownError.statusCode).json({
                message: thrownError.message,
                details: thrownError.details,
            })
        }

        if (thrownError instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "Application error",
                message: thrownError.message,
            })
        }

        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Application Error",
            message: "An unexpected error occurred in the application!",
        })
    }

    private transformOutputToSnakeCase(response: Array<any>) {
        return toSnakeCase(response)
    }
}
