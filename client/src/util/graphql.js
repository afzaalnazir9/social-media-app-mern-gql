import { gql } from '@apollo/client';

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
        id
        body
        createdAt
        username
        comments {
            id
            createdAt
            username
            body
        }
        likes {
            id
            createdAt
            username
        }
    }
  }
`;

const SUBS_PACKAGES = gql`
  {
    allPrices {
      id
      nickname
      product
      active
      unit_amount
      currency
      type
      recurring {
        interval
        interval_count
      }
    }
  }
`;

export { FETCH_POSTS_QUERY, SUBS_PACKAGES }