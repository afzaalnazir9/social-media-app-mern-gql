const stripe = require('../../utils/stripe');
const contextAuth = require('../../utils/context-auth');
const User = require('../../Models/users');

module.exports = {
    Query : {
        allPrices: async () => {
            const prices = await stripe.prices.list();
            return prices.data;
        },
    },
    Mutation : {
        async createSubscriptionCheckoutSession(_, { priceId }, context) {
          const user = contextAuth(context);
          if (user) {
            const userExist = await User.findOne({ username : user.username });
            const session = await stripe.checkout.sessions.create({
              mode: 'subscription',
              customer: userExist.customerID,
              payment_method_types: ['card'],
              line_items: [{
                price: priceId,
                quantity: 1,
              }],
              success_url: 'http://localhost:3000',
              cancel_url: 'http://localhost:3000',
            });

            return {
              ...session
            };
          }
          else {
            throw new Error('Customer not Found');
          }

        }
    }
}
