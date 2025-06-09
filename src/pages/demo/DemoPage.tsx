import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const DemoPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Demo / Get Started
        </Typography>
        <Typography variant="body1">
          This page will provide download links, onboarding guides, and sample use cases as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default DemoPage; 