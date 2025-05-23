import { SignOptions } from "jsonwebtoken"

export interface JwtInterface {
    sign(payload: any, options?: SignOptions): string
    verify(token: string, options?: SignOptions): any
    decode(token: string): any
}

export const JWT_KEY = Symbol("JwtInterface")
