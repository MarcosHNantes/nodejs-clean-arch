import { BadRequestException } from "@/shared/domain"
import { toCamelCase } from "@/shared/helpers"
import { Request } from "express"
import { GenericRequest } from "./middlewares/verify-token.middleware"

type FoundErrors = {
    missing_fields: string[]
    incorrect_types: string[]
}

export abstract class PayloadAction {
    protected getBodyContent<T = any>(request: Request): T & { token: any } {
        const body = request.body
        const camelizedBody = toCamelCase(body)
        const token = (request as GenericRequest).decodedToken

        return { ...camelizedBody, token } as T & { token: any }
    }

    protected getURLParameters(request: Request): any {
        const params = request.params
        const camelizedParams = toCamelCase(params)
        const token = (request as GenericRequest).decodedToken

        return { ...camelizedParams, token }
    }

    protected getQueryParameters(request: Request): any {
        const query = request.query
        const camelizedQuery = toCamelCase(query)
        const token = (request as GenericRequest).decodedToken

        return { ...camelizedQuery, token }
    }

    protected validateRequiredParameters(
        receivedParameters: Object,
        requiredParameters: IRequiredParameters[],
    ) {
        const missingRequiredFields: string[] = []
        const incorrectTypes: string[] = []
        const foundErrors: FoundErrors = {
            missing_fields: [],
            incorrect_types: [],
        }

        requiredParameters.forEach(parameter => {
            const existenceValidation = this.validateRequiredFieldInRequest(
                receivedParameters,
                parameter,
            )

            const typeValidation = this.validateTypeOfRequiredParameter(
                receivedParameters,
                parameter,
            )

            if (existenceValidation) {
                missingRequiredFields.push(existenceValidation)
            }

            if (typeValidation) {
                incorrectTypes.push(typeValidation)
            }
        })

        if (missingRequiredFields.length > 0) {
            foundErrors.missing_fields.push(...missingRequiredFields)
        }

        if (incorrectTypes.length > 0) {
            foundErrors.incorrect_types.push(...incorrectTypes)
        }

        if (
            foundErrors.missing_fields.length > 0 ||
            foundErrors.incorrect_types.length > 0
        ) {
            throw new BadRequestException(JSON.stringify(foundErrors))
        }
    }

    private validateRequiredFieldInRequest(
        receivedParameters: Object,
        parameter: IRequiredParameters,
    ): string {
        if (!Object.keys(receivedParameters).includes(parameter.field)) {
            return `Field '${parameter.field}' is required!`
        }
    }

    private validateTypeOfRequiredParameter(
        receivedParameters: Object,
        parameter: IRequiredParameters,
    ): string {
        let incorrectFieldMessage = ""

        Object.entries(receivedParameters).forEach(
            ([receivedKey, receivedValue]) => {
                if (
                    receivedKey === parameter.field &&
                    typeof receivedValue !== parameter.type
                ) {
                    incorrectFieldMessage =
                        `Invalid type for field '${parameter.field}'! ` +
                        `Expected '${parameter.type}', received '${typeof receivedValue}'`
                }
            },
        )

        return incorrectFieldMessage
    }
}

export interface IRequiredParameters {
    field: string
    type: "string" | "number" | "boolean" | "object"
}
