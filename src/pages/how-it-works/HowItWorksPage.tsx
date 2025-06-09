import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const HowItWorksPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body1">
          This page will provide a step-by-step visual guide, interactive walkthrough, explainer video, and user flow diagrams as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default HowItWorksPage; 