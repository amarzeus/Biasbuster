import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AccessibilityPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Accessibility Statement
        </Typography>
        <Typography variant="body1">
          This page will provide commitment to inclusivity, WCAG compliance, and how to request accommodations as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default AccessibilityPage; 