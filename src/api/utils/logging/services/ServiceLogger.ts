import { BaseLogger } from "../BaseLogger";

export class ServiceLogger extends BaseLogger {
    protected readonly filePath: string;
    protected route: string = '';
    protected loggingOf: string = '';

    constructor(message: string, loggingOf: string, service: string) {
        super(message);
        this.filePath = `/${service}.${loggingOf}.log`;
    }

    getFilePath() {
        return this.filePath;
    }

}