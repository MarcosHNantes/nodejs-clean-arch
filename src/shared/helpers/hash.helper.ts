import bcrypt from "bcrypt"

export async function createHash(content: string) {
    try {
        const createdHash = await bcrypt.hash(content, 10)
        return createdHash
    } catch (error) {
        throw new Error("Error creating hash!")
    }
}

export async function compareHash(content: string, hashedContent: string) {
    try {
        return await bcrypt.compare(content, hashedContent)
    } catch (error) {
        throw new Error("Error comparing hashes!")
    }
}
