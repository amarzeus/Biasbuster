import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const BlogPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Blog / News
        </Typography>
        <Typography variant="body1">
          This page will provide updates, research articles, case studies, and project milestones as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default BlogPage; 