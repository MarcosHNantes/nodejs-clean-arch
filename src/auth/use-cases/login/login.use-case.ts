import { AuthException } from "@/auth/domain"
import {
    compareHash,
    JWT_KEY,
    JwtInterface,
    UnauthorizedException,
    USERS_REPOSITORY_KEY,
    UsersRepositoryInterface,
} from "@/shared"
import { autoInjectable, inject } from "tsyringe"
import { LoginInputBoundary } from "./login.input-boundary"

@autoInjectable()
export class LoginUseCase {
    constructor(
        @inject(USERS_REPOSITORY_KEY)
        private readonly usersRepository: UsersRepositoryInterface,
        @inject(JWT_KEY)
        private readonly jwtToken: JwtInterface,
    ) {}

    public async handle(input: LoginInputBoundary) {
        try {
            const foundUser = await this.usersRepository.findByEmailOrUsername(
                input.username,
            )

            if (!foundUser) {
                throw new UnauthorizedException("Invalid credentials!")
            }

            const passwordsMatch = await compareHash(
                input.password,
                foundUser.getPassword(),
            )

            if (!passwordsMatch) {
                throw new UnauthorizedException("Invalid credentials")
            }

            const token = this.jwtToken.sign(
                {
                    id: foundUser.getUuid(),
                    nome: foundUser.getUsername(),
                },
                { expiresIn: "6h" },
            )

            return { token }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error
            }

            throw new AuthException(
                "An error occurred while processing the login request!",
            )
        }
    }
}
