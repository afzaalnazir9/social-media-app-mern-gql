const postResolvers = require('./posts');
const userResolvers = require('./users');
const stripeResolvers = require('./stripe');
const commentsResolvers = require('./comments');

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query,
        ...stripeResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutataion,
        ...stripeResolvers.Mutation
    },
    Subscription: {
      ...postResolvers.Subscription
    },
}