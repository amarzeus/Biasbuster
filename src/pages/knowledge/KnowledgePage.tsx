import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const KnowledgePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Knowledge Base
        </Typography>
        <Typography variant="body1">
          This page will provide centralized, AI-powered documentation and support for users and AI agents, with semantic search as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default KnowledgePage; 