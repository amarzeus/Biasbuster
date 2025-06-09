import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const PartnersPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Testimonials / Partners
        </Typography>
        <Typography variant="body1">
          This page will provide user reviews, partner logos, and success stories as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default PartnersPage; 