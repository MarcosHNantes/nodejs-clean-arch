export class CreateUserDto {
    constructor(
        public readonly uuid: string,
        public readonly password: string,
        public readonly username?: string,
        public readonly email?: string,
    ) {}
}
