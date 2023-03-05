const { UserInputError } = require('apollo-server-express');
const User = require('../../Models/users');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../../cloudinaryData');
const { createWriteStream } = require('fs');
const { v4: uuidv4 } = require('uuid');
const stripe = require('../../utils/stripe');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');
const SECRET_KEY = process.env.JWT_SECRET_KEY;


function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
            customerID : user.customerID
        },
        SECRET_KEY,
        { expiresIn : '1d' }
    );
}

module.exports = {
    Mutation : {
        uploadFile: async (_, { file }) => {
            const { createReadStream, filename, mimetype, encoding } = await file;
            const stream = createReadStream();
            const path = `uploads/${filename}`;
            return new Promise((resolve, reject) =>
              stream
                .pipe(createWriteStream(path))
                .on('finish', () => resolve(`http://localhost:5000/${path}`))
                .on('error', reject),
            );
        },
        async login(_, 
        {
            username, password
        }) {
            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError( 'Errors', { errors } );
            }
            const userExist = await User.findOne({ username });
            if (!userExist) {
                errors.general = 'User not found';
                throw new UserInputError('Wrong credentials', { errors });
            }
            else {
                const match = await bcrpyt.compare(password, userExist.password);
                if (!match) {
                    errors.general = 'Wrong credentials';
                    throw new UserInputError('Wrong credentials', { errors });
                }
            }
            const token = generateToken(userExist);
            return {
                ...userExist._doc,
                id: userExist._id,
                token
            }

        },
        async register(_, 
            {
                registerInput: { username, email, password, confirmPassword, profileImage } 
            }
            ) {
                const { valid, errors } = validateRegisterInput( username, email, password, confirmPassword, profileImage );
                if (!valid) {
                    throw new UserInputError( 'Errors', { errors } );
                }
                const userExist = await User.findOne({ username });
                if(userExist) {
                   throw new UserInputError('Username is taken', {
                        errors: {
                            username: "This username is taken" 
                        }
                    } 
                   ); 
                }
                password = await bcrpyt.hash(password, 12);

                const customerID = await stripe.customers.create({
                    email
                }, {
                    apiKey: process.env.STRIPE_SECRET_KEY
                });

                const newUser = new User({
                    email, 
                    username, 
                    password,
                    profileImage,
                    customerID: customerID.id,
                    createdAt: new Date().toISOString()
                });
                const res = await newUser.save();
                const token = generateToken(res);
                return {
                    ...res._doc,
                    id: res._id,
                    token,
                }
            }
    }
}