import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const JudgesPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Judges' Corner
        </Typography>
        <Typography variant="body1">
          This page will provide technical architecture, project timeline, team bios, and Startupathon-specific resources as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default JudgesPage; 