import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CommunityPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Community / Feedback
        </Typography>
        <Typography variant="body1">
          This page will provide a forum, feedback form, GitHub link, and user engagement tools as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default CommunityPage; 