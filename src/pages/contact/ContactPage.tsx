import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ContactPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1">
          This page will provide a contact form, support email, social links, and office locations as per the PRD.
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactPage; 