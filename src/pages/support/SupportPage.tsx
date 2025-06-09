import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const SupportPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Support / Help Center
        </Typography>
        <Typography variant="body1">
          This page will provide AI-powered documentation, troubleshooting guides, and live chat as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default SupportPage; 