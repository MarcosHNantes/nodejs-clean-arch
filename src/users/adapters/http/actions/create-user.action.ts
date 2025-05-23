import { BadRequestException, PayloadAction } from "@/shared"
import { CreateUserInputBoundary, CreateUserUseCase } from "@/users/use-cases"
import { Request } from "express"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export class CreateUserAction extends PayloadAction {
    constructor(private readonly useCase: CreateUserUseCase) {
        super()
    }

    async handle(request: Request): Promise<any> {
        const requestBody =
            this.getBodyContent<CreateUserInputBoundary>(request)

        this.validateRequiredParameters(requestBody, [
            { field: "password", type: "string" },
        ])

        if (!requestBody.username && !requestBody.email) {
            throw new BadRequestException(
                "User must have at least one of email or username!",
            )
        }

        const input = new CreateUserInputBoundary(
            requestBody.password,
            requestBody.username,
            requestBody.email,
        )

        return await this.useCase.handle(input)
    }
}
