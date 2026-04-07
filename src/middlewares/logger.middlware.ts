import { NextFunction, Request, Response } from "express"

const _requestLogger = (req: Request) => {
    const method = req.method
    const url = req.originalUrl || req.url
    const headers = req.headers

    let curl = [`curl --location --request ${method} "${req.protocol}://${req.get("host")}${url}"`]

    // Headers
    for (const [key, value] of Object.entries(headers)) {
        // filter Host & Content-Length (let curl handle these)
        if (key.toLowerCase() === "host" || key.toLowerCase() === "content-length") continue
        if (Array.isArray(value)) {
            value.forEach(v => curl.push(`--header '${key}: ${v}'`))
        } else if (value) {
            curl.push(`--header '${key}: ${value}'`)
        }
    }

    // Handle form-data (Postman style)
    if (
        headers["content-type"]?.toString().includes("multipart/form-data") &&
        req.body &&
        typeof req.body === "object"
    ) {
        Object.entries(req.body).forEach(([key, value]) => {
            curl.push(`--form '${key}=${value}'`)
        })
        // Handle JSON body
    } else if (req.body && Object.keys(req.body).length > 0 && typeof req.body === "object") {
        curl.push(`--data-raw '${JSON.stringify(req.body)}'`)
    }

    const curlCommand = curl.join(" \\\n  ")
    // Log like Postman cURL preview
    console.log("=".repeat(40))
    console.log("cURL Request:")
    console.log(curlCommand)
    console.log("=".repeat(40))
}


const loggerMiddlware = (req: Request, res: Response, next: NextFunction) => {
    _requestLogger(req)
    next()
}


export default loggerMiddlware