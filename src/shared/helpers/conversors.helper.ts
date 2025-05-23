import { camelCase, snakeCase } from "lodash"
import { InvalidArgumentException } from "../domain"

export function toSnakeCase(receivedObject: Object) {
    if (Array.isArray(receivedObject)) {
        return receivedObject.map(v => toSnakeCase(v))
    }

    if (receivedObject != null && receivedObject.constructor === Object) {
        return Object.keys(receivedObject).reduce(
            (result, key) => ({
                ...result,
                [snakeCase(key)]: toSnakeCase(receivedObject[key]),
            }),
            {},
        )
    }

    return receivedObject
}

export function toCamelCase(receivedObject: Object) {
    if (Array.isArray(receivedObject)) {
        return receivedObject.map(v => toCamelCase(v))
    }

    if (receivedObject != null && receivedObject.constructor === Object) {
        return Object.keys(receivedObject).reduce(
            (result, key) => ({
                ...result,
                [camelCase(key)]: toCamelCase(receivedObject[key]),
            }),
            {},
        )
    }

    return receivedObject
}

export const stringToHexadecimal = (content: string) => {
    return Array.from(content)
        .map(c =>
            c.charCodeAt(0) < 128
                ? c.charCodeAt(0).toString(16)
                : encodeURIComponent(c).replace(/\%/g, "").toLowerCase(),
        )
        .join("")
}

export const hexadecimalToString = (hexString: string) => {
    return decodeURIComponent(hexString.replace(/(..)/g, "%$1"))
}

export const roundValue = (value: number, decimalPlaces = 2) => {
    if (decimalPlaces > 20) {
        throw new InvalidArgumentException(
            "Decimal places for rounding must not exceed 20!",
        )
    }

    return Math.round(value).toFixed(decimalPlaces)
}

export const onlyNumbersFromString = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, "")
    return onlyNumbers
}
