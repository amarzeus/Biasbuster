import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const PressPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Press Kit
        </Typography>
        <Typography variant="body1">
          This page will provide logos, screenshots, team bios, and press releases for media as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default PressPage; 