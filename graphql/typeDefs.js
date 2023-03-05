const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar Upload

    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        profileImage: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        profileImage: String!
        createdAt: String!
        customerID: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
        profileImage: String!
    }

    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }

    type Price {
        id: ID!
        nickname: String 
        product: String!
        active: Boolean!
        unit_amount: Int!
        currency: String!
        type: String!,
        recurring: PriceRecurring
    }

    type PriceRecurring {
        interval: String!
        interval_count: Int!
    }

    type Session {
        id: String!
        object: String!
        amount_subtotal: String!
        amount_total: String!
        customer_details: customerDetails
        livemode: Boolean!
        locale: String
        mode: String!
        payment_link: String
        payment_status: String!
        status: String!
        submit_type: String
        subscription: String
        success_url: String!
        cancel_url: String!
        url: String!
    }

    type customerDetails {
        address: String
        email: String!
        name: String
        phone: String
    }

    type Query {
        getPosts : [Post]
        getPost(postId: ID!): Post
        allPrices: [Price!]!
    }

    type Mutation {
        uploadFile(file: Upload!): String
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!) : User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post! 
        createSubscriptionCheckoutSession(priceId: String!): Session!
    }

    type Subscription {
        newPost: Post!
    }
`;  