export class CreateUserOutputBoundary {
    constructor(
        public readonly uuid: string,
        public readonly includedAt: Date,
        public readonly username?: string,
        public readonly email?: string,
    ) {}
}
