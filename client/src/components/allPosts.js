import * as React from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import PostCard from './postCard';
import PostForm from './PostForm';

const AllPosts = () => {

    const {
        loading,
        data
      } = useQuery(FETCH_POSTS_QUERY);
    
    return (
    <>
        <Typography component={'h1'} sx={{textAlign:'center', fontSize:'26px', mb:3, fontWeight:600}}>
            Recent Posts
        </Typography>
        <PostForm />
        {loading ? (
        <Box sx={{textAlign: 'center'}}>
            <CircularProgress />
        </Box>
        ) : 
            <Grid container spacing={2}>
                {data && data.getPosts.map(post => (
                    <PostCard post={post} key={post.id} />
                ))}
            </Grid>
        }        
    </>
  )
}

export default AllPosts