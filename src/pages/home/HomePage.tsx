import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.common.white,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/hero-pattern.svg")',
    opacity: 0.1,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
}));

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: 'Real-time Analysis',
      description: 'Instant bias detection in your content with advanced AI algorithms.',
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Comprehensive Coverage',
      description: 'Detect multiple types of bias including gender, racial, and cultural biases.',
    },
    {
      icon: <AnalyticsIcon fontSize="large" color="primary" />,
      title: 'Detailed Analytics',
      description: 'Get insights into bias patterns and trends in your content.',
    },
    {
      icon: <SchoolIcon fontSize="large" color="primary" />,
      title: 'Educational Resources',
      description: 'Learn about bias and how to create more inclusive content.',
    },
  ];

  const testimonials = [
    {
      quote: "Biasbuster has transformed how we review our content. It's an essential tool for any organization committed to inclusivity.",
      author: "Sarah Johnson",
      role: "Content Director, TechCorp",
    },
    {
      quote: "The analytics dashboard provides invaluable insights into our content's inclusivity. Highly recommended!",
      author: "Michael Chen",
      role: "Editor-in-Chief, Global News",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" component="h1" gutterBottom>
                Detect and Eliminate Bias in Your Content
              </Typography>
              <Typography variant="h5" paragraph>
                Advanced AI-powered bias detection for more inclusive and fair content creation.
              </Typography>
              <Box mt={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ mr: 2, mb: isMobile ? 2 : 0 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-illustration.svg"
                alt="Bias Detection Illustration"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Everything you need to create bias-free content
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard>
                <CardContent>
                  <Box display="flex" justifyContent="center" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            Trusted by Industry Leaders
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <TestimonialCard>
                  <Typography variant="h6" gutterBottom>
                    "{testimonial.quote}"
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {testimonial.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.role}
                  </Typography>
                </TestimonialCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 6,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Create More Inclusive Content?
          </Typography>
          <Typography variant="h6" paragraph>
            Join thousands of organizations already using Biasbuster
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2 }}
          >
            Start Free Trial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 