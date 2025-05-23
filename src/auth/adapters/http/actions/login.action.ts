import { LoginInputBoundary, LoginUseCase } from "@/auth/use-cases"
import { PayloadAction } from "@/shared"
import { Request } from "express"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export class LoginAction extends PayloadAction {
    constructor(private readonly useCase: LoginUseCase) {
        super()
    }

    async handle(request: Request): Promise<any> {
        const bodyRecebido = this.getBodyContent<LoginInputBoundary>(request)

        this.validateRequiredParameters(bodyRecebido, [
            { field: "username", type: "string" },
            { field: "password", type: "string" },
        ])

        const input = new LoginInputBoundary(
            bodyRecebido.username,
            bodyRecebido.password,
        )

        return await this.useCase.handle(input)
    }
}
