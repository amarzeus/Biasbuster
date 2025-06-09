import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    color: theme.palette.common.white,
    padding: theme.spacing(4)
}));

const FeatureCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-5px)'
    }
}));

const HomePage: React.FC = () => {
    return (
        <>
            <HeroSection>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h1" gutterBottom>
                                Biasbuster
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                AI-Powered Bias Detection & Education
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Real-time, explainable bias detection and education platform.
                                Spot, understand, and mitigate bias in news and AI-generated content.
                            </Typography>
                            <Box mt={4}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    href="/get-started"
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="large"
                                    href="/how-it-works"
                                    sx={{ ml: 2 }}
                                >
                                    Learn More
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* Live Demo Widget */}
                            <Box
                                component="img"
                                src="/demo-screenshot.svg"
                                alt="Biasbuster Demo"
                                sx={{
                                    width: '100%',
                                    maxWidth: 600,
                                    height: 'auto'
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </HeroSection>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" align="center" gutterBottom>
                    Key Features
                </Typography>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4}>
                        <FeatureCard>
                            <Typography variant="h5" gutterBottom>
                                Real-Time Detection
                            </Typography>
                            <Typography>
                                Instant bias detection with explainable AI technology.
                            </Typography>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard>
                            <Typography variant="h5" gutterBottom>
                                Educational Resources
                            </Typography>
                            <Typography>
                                Comprehensive learning materials to understand and combat bias.
                            </Typography>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard>
                            <Typography variant="h5" gutterBottom>
                                Customizable Analysis
                            </Typography>
                            <Typography>
                                Tailor detection to your needs with customizable settings.
                            </Typography>
                        </FeatureCard>
                    </Grid>
                </Grid>
            </Container>

            <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" gutterBottom>
                        Trusted By
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                        {/* Add partner logos here */}
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" align="center" gutterBottom>
                    Testimonials
                </Typography>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {/* Add testimonials here */}
                </Grid>
            </Container>

            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom>
                        Ready to Start?
                    </Typography>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            href="/get-started"
                        >
                            Get Started Now
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default HomePage; 