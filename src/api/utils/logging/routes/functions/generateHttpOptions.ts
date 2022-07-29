import { IHttpOptions } from "../interfaces/IHttpOptions"

const generateHttpOptions = (req) => {
    const httpOptions: IHttpOptions = {
        method: req.method,
        path: req.originalUrl,
        hostname: req.hostname,
        version: req.httpVersion
    };
    return httpOptions;
}

export { generateHttpOptions }