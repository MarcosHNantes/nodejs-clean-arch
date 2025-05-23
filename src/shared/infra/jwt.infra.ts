import { envVariablesContainer } from "config"
import * as jwt from "jsonwebtoken"
import { autoInjectable } from "tsyringe"
import { JwtInterface } from "../adapters"

interface IJwtConfig {
    secret: string
}

@autoInjectable()
export class JwtToken implements JwtInterface {
    private jwtConfig: IJwtConfig

    constructor() {
        this.jwtConfig = envVariablesContainer.jwt
    }

    sign(payload: any, options?: jwt.SignOptions): string {
        const expiresIn = options.expiresIn ?? "1d"
        return jwt.sign(payload, this.jwtConfig.secret, {
            ...options,
            expiresIn,
        })
    }

    verify(token: string, options?: jwt.SignOptions): any {
        return jwt.verify(token, this.jwtConfig.secret, options)
    }

    decode(token: string): any {
        return jwt.decode(token)
    }
}
