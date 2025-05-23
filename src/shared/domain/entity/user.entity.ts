export class User {
    private id: number
    private uuid: string
    private username: string
    private email: string
    private password: string
    private createdAt?: Date = null
    private updatedAt?: Date = null

    public constructor(
        id: number,
        uuid: string,
        username: string,
        email: string,
        password: string,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this.id = id
        this.uuid = uuid
        this.username = username
        this.email = email
        this.password = password
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public getId(): number {
        return this.id
    }

    public getUuid(): string {
        return this.uuid
    }

    public getUsername(): string {
        return this.username
    }
    public getEmail(): string {
        return this.email
    }

    public getPassword(): string {
        return this.password
    }
    public getCreatedAt(): Date | null {
        return this.createdAt
    }

    public getUpdatedAt(): Date | null {
        return this.updatedAt
    }

    public setId(id: number): void {
        this.id = id
    }

    public setUuid(uuid: string): void {
        this.uuid = uuid
    }

    public setUsername(username: string): void {
        this.username = username
    }

    public setEmail(email: string): void {
        this.email = email
    }

    public setPassword(password: string): void {
        this.password = password
    }

    public setCreatedAt(createdAt?: Date): void {
        this.createdAt = createdAt
    }

    public setUpdatedAt(updatedAt?: Date): void {
        this.updatedAt = updatedAt
    }

    public toJSON(): object {
        return {
            id: this.id,
            uuid: this.uuid,
            username: this.username,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
