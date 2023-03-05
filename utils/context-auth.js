const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
    // Bearer ...
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
               const user = jwt.verify(token, SECRET_KEY);
               return user;
            } catch (error) {
                throw new AuthenticationError('Invalid/expired token');
            }
        }
        throw new Error("Authorization token must be 'Bearer [token]'");
    } 
    throw new Error('Authorization header not provided');
}