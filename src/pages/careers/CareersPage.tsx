import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CareersPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Careers
        </Typography>
        <Typography variant="body1">
          This page will provide job openings and an application portal as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default CareersPage; 