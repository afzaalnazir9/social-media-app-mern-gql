import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { Box, Typography, TextField, Button, Card } from '@mui/material';
import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from '../util/graphql';

const PostForm = () => {

const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
  });


    function createPostCallback() {
        createPost();
    }

  return (
    <Card sx={{ mb: 3, p: 2 }}>
    <Box component={'form'} sx={{ width : '100%'}} onSubmit={onSubmit}>
      <Typography variant='h2' sx={{
        fontSize : '24px'
      }}>
        Create Post :
      </Typography>
      <TextField
        placeholder="Hi World!"
        name="body"
        sx={{ mb:2, mt:2, width: '100%' }}
        id="outlined-multiline-flexible"
        multiline
        onChange={onChange}
        value={values.body}
        maxRows={2}
        error={error ? true : false}
      />            
      <Button variant='contained' sx={{ display: 'block' }} type='submit'>Post</Button>
    </Box>
    {error && (
        <div className="error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
    )}
  </Card>
  )
}

export default PostForm

const CREATE_POST_MUTATION = gql`
mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;
