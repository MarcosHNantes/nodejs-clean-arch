import { envVariablesContainer } from "config"
import CryptoJS from "crypto-js"
import { RuntimeException } from "../domain"
import { hexadecimalToString, stringToHexadecimal } from "./conversors.helper"

export function generateRandomUuid(): string {
    return crypto.randomUUID()
}

export function encrypt(content: string): string {
    try {
        const encryptedText = CryptoJS.AES.encrypt(
            content,
            envVariablesContainer.cipher.secret,
        ).toString()
        const encodedText = stringToHexadecimal(encryptedText)

        return encodedText
    } catch (error) {
        throw new RuntimeException("Error encrypting content!")
    }
}

export function decrypt(encryptedContent: string) {
    try {
        const encryptedText = hexadecimalToString(encryptedContent)
        const bytes = CryptoJS.AES.decrypt(
            encryptedText,
            envVariablesContainer.cipher.secret,
        )
        const decodedText = bytes.toString(CryptoJS.enc.Utf8)

        return decodedText
    } catch (error) {
        throw new RuntimeException("Error decrypting content!")
    }
}
