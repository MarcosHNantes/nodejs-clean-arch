export class CreateUserInputBoundary {
    constructor(
        public readonly password: string,
        public readonly username?: string,
        public readonly email?: string,
    ) {}
}
