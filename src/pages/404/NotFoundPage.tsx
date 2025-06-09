import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1">
          This page will provide a custom error page with navigation options as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 