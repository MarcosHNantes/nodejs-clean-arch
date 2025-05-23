export function getCurrentDateTime(): string {
    const now = new Date()
    const year = now.toLocaleString("default", { year: "numeric" })
    const month = now.toLocaleString("default", { month: "2-digit" })
    const day = now.toLocaleString("default", { day: "2-digit" })
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

    const dbFormatDate = [year, month, day].join("-")

    return `${dbFormatDate} ${time}`
}
