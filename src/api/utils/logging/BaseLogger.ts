import { appendFile } from 'fs';
import path from 'path';
import { IAppendOptions } from './routes/interfaces/IAppendOptions';


export class BaseLogger {
    protected static readonly logBaseDir: string = '/logs';
    protected message: string = '';

    append(logPath: string, options?: IAppendOptions): void {
        const date = new Date().toLocaleString('en-US', { timeZone: 'Europe/Bucharest' });
        const formattedDate = new Date(date).toJSON();
        let data = `[${formattedDate}] ${this.getMessage()} \n`;

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
