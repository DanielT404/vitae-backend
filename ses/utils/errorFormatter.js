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
            return 'Please solve the reCAPTCHA challenge.'
            break
        default:
            break
    }
}

export default errorFormatter
