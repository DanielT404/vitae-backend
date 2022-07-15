import { BaseLogger } from "../BaseLogger";
import { LoggingOf } from "../enum/LoggingOf";
import { Services } from "../enum/Services";

export class ServiceLogger extends BaseLogger {
    protected filePath: string;
    protected route: string
    protected service: Services;
    protected loggingOf: LoggingOf;

    getFilePath() {
        this.filePath = `/${this.service}.${this.loggingOf}.log`
        return this.filePath;
    }

    setService(service: Services) {
        this.service = service;
        return this;
    }

    setLoggingOf(loggingOf: LoggingOf) {
        this.loggingOf = loggingOf;
        return this;
    }

}