import path from 'path';
import { appendFile } from 'fs';
import { IAppendOptions } from './routes/interfaces/IAppendOptions';

import { getCurrentTime } from 'utils/date/getCurrentTime';


export class BaseLogger {
    protected static readonly logBaseDir: string = '/logs';
    protected message = '';

    append(logPath: string, options?: IAppendOptions): void {
        let data = `[${getCurrentTime()}] ${this.getMessage()} \n`;

        if (options?.http) {
            const { hostname, method, path, version } = options.http;
            data += `\t ${method} ${path} HTTP/${version} \n`;
            data += `\t Host: ${hostname} \n`;
        }

        appendFile(
            path.join(path.normalize(path.resolve()), `${BaseLogger.logBaseDir}${logPath}`),
            `${data}`,
            'utf-8',
            (err) => {
                if (err) throw new Error(`Failed to append inside ${BaseLogger.logBaseDir}/${logPath}. \n Error given: ${err}`);
            }
        )
    }

    getMessage() {
        return this.message;
    }

    setMessage(message: string) {
        this.message = message;
        return this;
    }
}
