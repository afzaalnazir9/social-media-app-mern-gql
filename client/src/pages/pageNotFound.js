import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '50px',
      }}
    >
      <Typography variant="h1">
        404
      </Typography>
      <Typography variant="h6">
        The page you’re looking for doesn’t exist.
      </Typography>
      <Link to="/">
          <Button variant="contained" sx={{mt:'20px'}}>Back Home</Button>
      </Link>
    </Box>
  );
}