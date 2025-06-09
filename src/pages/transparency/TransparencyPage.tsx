import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const TransparencyPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Transparency Reports
        </Typography>
        <Typography variant="body1">
          This page will provide regular updates on fairness, accuracy, and user feedback with visual summaries as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default TransparencyPage; 