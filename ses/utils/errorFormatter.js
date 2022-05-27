const errorFormatter = ({ param }) => {
    switch (param) {
        case 'name':
            return 'Name must consist of atleast 3 characters.'
            break
        case 'email':
            return 'Invalid email, please try again.'
            break
        case 'message':
            return 'Message must consist of atleast 15 characters.'
            break
        case 'token':
            return 'You must solve reCAPTCHA challenge to proceed.'
            break
        case 'secret':
            return 'Uh oh! There seems to be some misconfiguration. Contact website owner.'
            break
        default:
            break
    }
}

export default errorFormatter
