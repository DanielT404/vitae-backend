import { BaseLogger } from "../BaseLogger";

import { LoggingOf } from "../enum/LoggingOf";
import { Services } from "../enum/Services";

export class RouteLogger extends BaseLogger {
    protected logDir = `routes`;
    protected route = '';
    protected message = '';
    protected loggingOf: LoggingOf = LoggingOf.debug;
    protected service: Services = Services.DynamoDB;

    constructor(route: string) {
        super();
        this.route = route;
    }

    getRoute(): string {
        return this.route;
    }

    getLoggingOf(): LoggingOf {
        return this.loggingOf;
    }

    getService(): Services {
        return this.service;
    }

    getLogDir(): string {
        let logDir = `/${this.logDir}/${this.route}/${this.loggingOf}`;
        if (this.service) {
            logDir += `.${this.service}.log`;
        } else {
            logDir += `${this.getRoute()}.log`;
        }
        this.logDir = logDir;
        return logDir;
    }

    setRoute(route: string) {
        this.route = route;
        return this;
    }

    setLoggingOf(loggingOf: LoggingOf) {
        this.loggingOf = loggingOf;
        return this;
    }

    setService(service: Services) {
        this.service = service;
        return this;
    }

}