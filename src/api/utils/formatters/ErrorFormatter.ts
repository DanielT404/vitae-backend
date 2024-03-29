export enum ErrorFormatterMethod {
    GET = "GET",
    POST = "POST"
}
export enum ErrorFormatterTypes {
    Email = "Email"
}

interface IExtendedErrorFormatter {
    setErrorMessage(message: string): void;
}

interface IErrorFormatter {
    getErrorMessage(args?: unknown): string;
}

interface IBaseErrorFormatter {
    createFormatter(formatterType: ErrorFormatterTypes): EmailErrorFormatter | BasicError;
}

export class ErrorFormatterFactory implements IBaseErrorFormatter {
    protected readonly _type: ErrorFormatterTypes = ErrorFormatterTypes.Email;
    protected readonly _method: ErrorFormatterMethod;
    protected readonly _message: string | undefined;

    constructor(method: ErrorFormatterMethod, message?: string) {
        this._method = method;
        this._message = message;
    }

    createFormatter(formatterType: ErrorFormatterTypes): EmailErrorFormatter | BasicError {
        let type;
        switch (formatterType) {
            case ErrorFormatterTypes.Email:
                type = new EmailErrorFormatter();
                break;
            default:
                type = new BasicError();
                break;
        }
        return type;
    }
}

class EmailErrorFormatter implements IErrorFormatter {
    getErrorMessage({ param }: { param: string }): string {
        switch (param) {
            case 'name':
                return `Name must consist of atleast 3 characters.`
            case 'email':
                return `Invalid email, please try again.`
            case 'message':
                return `Message must consist of atleast 15 characters.`
            case 'token':
                return `You must solve reCAPTCHA challenge to proceed.`
            case 'secret':
                return `Uh oh! There seems to be some misconfiguration. Contact website owner.`
            default:
                break
        }
        return '';
    }
}

class BasicError implements IErrorFormatter, IExtendedErrorFormatter {
    private _message = '';

    getErrorMessage(): string {
        return this._message;
    }
    setErrorMessage(message: string): void {
        this._message = message;
    }
}

