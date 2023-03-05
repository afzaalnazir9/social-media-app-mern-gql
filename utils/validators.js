var validator = require('validator');

module.exports.validateRegisterInput = ( username, email, password, confirmPassword, profileImage ) => {
    const errors = {};
    if (validator.isEmpty(username)) {
        errors.username = 'Username must not be empty';  
    }
    if (validator.isEmpty(email)) {
        errors.email = 'Email must not be empty';  
    } else {
        if (!validator.isEmail(email)) {
            errors.email = 'Email must be a valid email address';  
        }   
    }
    if (validator.isEmpty(password)) {
        errors.password = 'Password must not be empty';  
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Password must match'
    }
    if(!profileImage) {
        errors.profileImage = 'Please select profile image';  
    }

    return {
        errors,
        valid: Object.keys(errors) < 1 
    }   
}

module.exports.validateLoginInput = ( username, password ) => {
    const errors = {};
    if (validator.isEmpty(username)) {
        errors.username = 'Username must not be empty';  
    }
    if (validator.isEmpty(password)) {
        errors.password = 'Password must not be empty';  
    }

    return {
        errors,
        valid: Object.keys(errors) < 1 
    }   
}