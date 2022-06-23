export enum ErrorFormatterMethod {
    GET = "GET",
    POST = "POST"
}
export enum ErrorFormatterTypes {
    Email = "Email"
}

interface IErrorFormatter {
    getErrorType() : string
    getErrorMethod() : string
}

export class ErrorFormatter implements IErrorFormatter {
    protected readonly _type : string = "";
    protected readonly _method : string = "";

    constructor(type : ErrorFormatterTypes , method: ErrorFormatterMethod, message?: string) {
        this._type = type;
        this._method = method;
        switch(type) {
            case ErrorFormatterTypes.Email:
                return new EmailErrorFormatter(type, method);
            default:
                return new BasicError(type, method, message);
        }
    }

    getErrorType() {
        return this._type;
    }

    getErrorMethod() {
        return this._method;
    }

}

class BasicError extends ErrorFormatter {
    private readonly _message : any = "";

    constructor(type : ErrorFormatterTypes , method: ErrorFormatterMethod, message?: string) {
        super(type, method);
        this._message = message;
    }

    getErrorMessage() : string {
        return `[${super.getErrorMethod()} / ${super.getErrorType()}}] ${this._message}`;
    }
}

class EmailErrorFormatter extends ErrorFormatter {
    constructor(type: ErrorFormatterTypes, method: ErrorFormatterMethod) {
        super(type, method);
    }
    getErrorMessage({ param } : { param : string }) : string {
        switch (param) {
            case 'name':
                return `[${super.getErrorMethod()} / ${super.getErrorType()}}]Name must consist of atleast 3 characters.`
            case 'email':
                return `[${super.getErrorMethod()} / ${super.getErrorType()}}]Invalid email, please try again.`
            case 'message':
                return `[${super.getErrorMethod()} / ${super.getErrorType()}}]Message must consist of atleast 15 characters.`
            case 'token':
                return `[${super.getErrorMethod()} / ${super.getErrorType()}}]You must solve reCAPTCHA challenge to proceed.`
            case 'secret':
                return `[${super.getErrorMethod()} / ${super.getErrorType()}}]Uh oh! There seems to be some misconfiguration. Contact website owner.`
            default:
                break
        }
        return '';
    }
}

