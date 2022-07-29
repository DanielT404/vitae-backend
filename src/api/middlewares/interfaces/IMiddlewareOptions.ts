interface IRateLimitOptions {
    windowMs: number
}
interface ICORSOptions {
    origin: string
}
export interface IMiddlewareOptions {
    rateLimit: IRateLimitOptions,
    CORS: ICORSOptions
}