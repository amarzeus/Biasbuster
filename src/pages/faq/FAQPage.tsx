import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const FAQPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          FAQ
        </Typography>
        <Typography variant="body1">
          This page will provide organized, searchable answers to common questions as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default FAQPage; 