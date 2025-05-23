import {
    BadRequestException,
    createHash,
    CreateUserDto,
    generateRandomUuid,
    USERS_REPOSITORY_KEY,
    UsersRepositoryInterface,
} from "@/shared"
import { autoInjectable, inject } from "tsyringe"
import { CreateUserInputBoundary } from "./create-user.input-boundary"
import { CreateUserOutputBoundary } from "./create-user.output-boundary"

@autoInjectable()
export class CreateUserUseCase {
    constructor(
        @inject(USERS_REPOSITORY_KEY)
        private readonly usersRepository: UsersRepositoryInterface,
    ) {}

    public async handle(
        input: CreateUserInputBoundary,
    ): Promise<CreateUserOutputBoundary> {
        try {
            const foundUserWithReceivedEmailOrUsername =
                await this.usersRepository.findByEmailOrUsername(input.username)

            if (foundUserWithReceivedEmailOrUsername) {
                throw new BadRequestException("User already exists!")
            }

            const hashedPassword = await createHash(input.password)

            const createUserDto = new CreateUserDto(
                generateRandomUuid(),
                hashedPassword,
                input.username,
                input.email,
            )

            const createdUser = await this.usersRepository.create(createUserDto)

            return new CreateUserOutputBoundary(
                createdUser.getUuid(),
                createdUser.getCreatedAt(),
                createdUser.getUsername(),
                createdUser.getEmail(),
            )
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }

            // throw new AuthException(
            //     "An error occurred while processing the login request!",
            // )
        }
    }
}
