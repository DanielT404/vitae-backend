import { BaseLogger } from "../BaseLogger";

import { LoggingOf } from "../enum/LoggingOf";
import { Services } from "../enum/Services";

export class RouteLogger extends BaseLogger {
    protected readonly filePath: string;
    protected loggingOf: string = '';

    constructor(message: string, dir: string, loggingOf: LoggingOf, service?: Services) {
        super(message);
        this.filePath = `/routes/${dir}/${loggingOf}`;
        if(service) {
            this.filePath += `.${service}.log`;
        } else {
            this.filePath += `.log`;
        }
    }

    getFilePath() {
        return this.filePath;
    }
}