const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const multer = require('multer');
const cors = require("cors");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('./cloudinaryData'); 
const { default: mongoose } = require("mongoose");
const { PubSub } = require('graphql-subscriptions');
require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const stripe = require('./utils/stripe');
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, { cors: { origin: 'http://localhost:3000' } }) //for omit cors error

app.use(cors());
app.use(express.json());

const onConnection = (socket) => {
  console.log('User connected');
  socket.on('formSubmitted', (data) => {
    console.log('Form submitted:', data);
    io.emit('formSaved', { message: 'Form data saved successfully!' });
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

io.on('connection', onConnection);

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs');
const User = require('./Models/users');

const pubsub = new PubSub();
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req, pubsub }) });

mongoose.set('strictQuery', false);
const MONGO_URI = process.env.MONGO_CONNECT_URL;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("DB Connected successfully");
}).catch((err) => {
    console.log('DB not connected', err);
});

    async function startServer() {



      const calculateOrderAmount = (items) => {
        let subtotal = 0;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            subtotal += item.price * item.quantity;
          }
        }
      
        const taxRate = 0.1; // 10% tax
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount + 500; // Add $5.00 flat fee
      
        return total;
      };

      app.get("/config", (req, res) => {
        res.send({
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
      });
      
      app.post('/api/payment-intent', async (req, res) => {
        const { paymentMethodId, product } = req.body;
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: product.unit_amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            description: product.description
          });
      
          const paymentIntentCheck = await stripe.paymentIntents.retrieve(paymentIntent.id);
          if (paymentIntentCheck.status === 'succeeded') {
            res.json({ paymentIntentCheck, message: "PaymentIntent has already been confirmed" });
            // PaymentIntent has already been confirmed
          } else {
            const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
            res.json({ clientSecret: paymentIntent.client_secret });
          }
          
          res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      });
      

      app.post("/create-payment-intent", async (req, res) => {
        const { items } = req.body;
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount: calculateOrderAmount(items),
          currency: "usd",
          // automatic_payment_methods: {
          //   enabled: true,
          // },
        });
      
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      });
      

    const getUser =  (req) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
        // Bearer ...
            const token = authHeader.split('Bearer ')[1];
            if (token) {
                try {
                   const user = jwt.verify(token, SECRET_KEY);
                   return user;
                } catch (error) {
                    throw new Error('Invalid/expired token');
                }
            }
            throw new Error("Authorization token must be 'Bearer [token]'");
        } 
        throw new Error('Authorization header not provided');
    }


      app.post('/create-subscription', async (req, res) => {
        // Simulate authenticated user. In practice this will be the
        // Stripe Customer ID related to the authenticated user.
        const user = getUser(req);
        if (user) {
          const userExist = await User.findOne({ username : user.username });
          // Create the subscription
          const priceId = req.body.priceId;
          try {
            const subscription = await stripe.subscriptions.create({
              customer: userExist.customerID,
              items: [{
                price: priceId,
              }],
              payment_behavior: 'default_incomplete',
              expand: ['latest_invoice.payment_intent'],
            });
        
            res.send({
              subscriptionId: subscription.id,
              clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            });
          } catch (error) {
            return res.status(400).send({ error: { message: error.message } });
          }
        }
      });
      
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads');
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        });
        const upload = multer({ storage });

        app.post('/upload', upload.single('profileImage'), async (req, res) => {
            const file = req.file;
            const { filename } = file;
            const folderName = uuidv4();
            const userAssets = await cloudinary.api.create_folder(`userProfile/${folderName}`, async function(error, result) {
                if (filename) {
                  await cloudinary.uploader.upload("uploads/"+filename,
                    {
                      // public_id: filename,
                      resource_type: "auto",
                      folder: `userProfile/${folderName}`,
                      streaming: true
                    }, (error, result) => {
                      if (error) {
                        throw new Error(error);
                      } else {
                        fileUrl = result?.url;
                        fs.unlink(req.file.path, (err) => {
                            if (err) {
                              console.error(err);
                              return;
                            }
                        });
                        res.json({ url: fileUrl });
                      }
                    });
                }
            });
        });

        await server.start();
        server.applyMiddleware({ app });
        httpServer.listen(5000, () => {
        console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
        });
    }
  
  startServer().catch((err) => {
    console.error(err);
  });