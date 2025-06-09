import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  AutoAwesome as AutoAwesomeIcon,
  IntegrationInstructions as IntegrationIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

// Styled components
const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/features-pattern.svg")',
    opacity: 0.1,
  },
}));

const FeaturesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: 'Real-time Analysis',
      description: 'Get instant feedback on potential bias in your content as you write.',
      benefits: [
        'Immediate bias detection',
        'Context-aware suggestions',
        'Multiple language support',
      ],
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Comprehensive Coverage',
      description: 'Detect various types of bias including gender, racial, cultural, and more.',
      benefits: [
        'Multiple bias categories',
        'Custom bias detection rules',
        'Regular updates to bias patterns',
      ],
    },
    {
      icon: <AnalyticsIcon fontSize="large" color="primary" />,
      title: 'Advanced Analytics',
      description: 'Gain insights into bias patterns and trends in your content.',
      benefits: [
        'Detailed bias reports',
        'Trend analysis',
        'Custom metrics tracking',
      ],
    },
    {
      icon: <SchoolIcon fontSize="large" color="primary" />,
      title: 'Educational Resources',
      description: 'Learn about bias and how to create more inclusive content.',
      benefits: [
        'Interactive tutorials',
        'Best practices guides',
        'Case studies',
      ],
    },
    {
      icon: <AutoAwesomeIcon fontSize="large" color="primary" />,
      title: 'AI-Powered Suggestions',
      description: 'Get intelligent recommendations for bias-free alternatives.',
      benefits: [
        'Context-aware suggestions',
        'Multiple alternatives',
        'Learning from user feedback',
      ],
    },
    {
      icon: <IntegrationIcon fontSize="large" color="primary" />,
      title: 'Easy Integration',
      description: 'Seamlessly integrate with your existing content creation tools.',
      benefits: [
        'API access',
        'Plugin support',
        'Custom integrations',
      ],
    },
  ];

  const pricingTiers = [
    {
      title: 'Starter',
      price: '$49',
      period: 'per month',
      features: [
        'Basic bias detection',
        'Up to 100,000 words/month',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      title: 'Professional',
      price: '$149',
      period: 'per month',
      features: [
        'Advanced bias detection',
        'Up to 500,000 words/month',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom rules',
      ],
      highlighted: true,
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Full feature access',
        'Unlimited words',
        '24/7 support',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
      ],
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
                Powerful Features for Bias-Free Content
              </Typography>
              <Typography variant="h5" paragraph>
                Everything you need to create inclusive and fair content
              </Typography>
              <Box mt={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ mr: 2, mb: isMobile ? 2 : 0 }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  Schedule Demo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/features-illustration.svg"
                alt="Features Illustration"
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

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Comprehensive tools for bias detection and mitigation
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {feature.icon}
                    <Typography variant="h5" component="h3" sx={{ ml: 2 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    {feature.description}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {feature.benefits.map((benefit, idx) => (
                      <Typography
                        component="li"
                        variant="body2"
                        color="textSecondary"
                        key={idx}
                        sx={{ mb: 1 }}
                      >
                        {benefit}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            Pricing Plans
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Choose the plan that fits your needs
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {pricingTiers.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    ...(tier.highlighted && {
                      border: `2px solid ${theme.palette.primary.main}`,
                      transform: 'scale(1.05)',
                    }),
                  }}
                >
                  <CardContent>
                    <Typography variant="h4" component="h3" align="center" gutterBottom>
                      {tier.title}
                    </Typography>
                    <Box textAlign="center" mb={3}>
                      <Typography variant="h3" component="div" color="primary">
                        {tier.price}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {tier.period}
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {tier.features.map((feature, idx) => (
                        <Typography
                          component="li"
                          variant="body2"
                          color="textSecondary"
                          key={idx}
                          sx={{ mb: 1 }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                    <Box mt={4} textAlign="center">
                      <Button
                        variant={tier.highlighted ? 'contained' : 'outlined'}
                        color="primary"
                        size="large"
                        fullWidth
                      >
                        Get Started
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
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
            Ready to Create Bias-Free Content?
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

export default FeaturesPage; 