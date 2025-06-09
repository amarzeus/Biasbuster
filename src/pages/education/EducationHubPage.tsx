import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const EducationHubPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Education Hub
        </Typography>
        <Typography variant="body1">
          This page will provide interactive lessons, quizzes, resources, progress tracking, and gamification as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default EducationHubPage; 