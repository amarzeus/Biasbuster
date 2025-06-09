import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const TermsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body1">
          This page will provide user agreement, acceptable use, and legal terms as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsPage; 