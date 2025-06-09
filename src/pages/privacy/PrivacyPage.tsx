import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const PrivacyPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1">
          This page will provide transparent data practices, GDPR/CCPA compliance, and user rights as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPage; 