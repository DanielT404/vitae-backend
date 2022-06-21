export enum ErrorFormatterMethod {
    GET = "GET",
    POST = "POST"
}
export enum ErrorFormatterTypes {
    Email = "Email"
}

class ErrorFormatter {
    private readonly _type : string = "";
    private readonly _method : string = "";

    constructor(type : ErrorFormatterTypes , method: ErrorFormatterMethod) {
        this._type = type;
        this._method = method;
    }
}

export class BasicError extends ErrorFormatter {
    private readonly _message : string = "";

    constructor(type : ErrorFormatterTypes , method: ErrorFormatterMethod, message: string) {
        super(type, method);
        this._message = `${message} thrown in ${method} ${type} route.`;
    }

    errorMessage(message: string) : string {
        return this._message;
    }
}

export class EmailErrorFormatter extends ErrorFormatter {
    constructor(type : ErrorFormatterTypes , method: ErrorFormatterMethod) {
        super(type, method);
    }

    errorMessage({ param } : { param : string }) : string {
        switch (param) {
            case 'name':
                return 'Name must consist of atleast 3 characters.'
            case 'email':
                return 'Invalid email, please try again.'
            case 'message':
                return 'Message must consist of atleast 15 characters.'
            case 'token':
                return 'You must solve reCAPTCHA challenge to proceed.'
            case 'secret':
                return 'Uh oh! There seems to be some misconfiguration. Contact website owner.'
            default:
                break
        }
        return '';
    }
}

