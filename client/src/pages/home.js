import * as React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import AllPosts from '../components/allPosts';
// import socket from '../util/socketHandler';

export default function Home() {
  const isLoggedIn = useSelector(state => state.auth.loginResponse);

  // socket.on('formSaved', (data) => {
  //   alert(data.message);
  // });

  return (
    <Box sx={{ mt : 3 }}>
        {isLoggedIn ? <AllPosts /> : "Please login to view posts" }
    </Box>
  );
}