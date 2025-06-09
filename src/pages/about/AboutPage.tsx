import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const MissionSection = styled(Box)(({ theme }) => ({
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
    background: 'url("/images/mission-pattern.svg")',
    opacity: 0.1,
  },
}));

const TeamCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const AboutPage: React.FC = () => {
  const theme = useTheme();

  const teamMembers = [
    {
      name: 'Dr. Emily Chen',
      role: 'Chief AI Ethics Officer',
      bio: 'PhD in AI Ethics with 15+ years of experience in bias detection and mitigation.',
      avatar: '/images/team/emily-chen.jpg',
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Product',
      bio: 'Former tech lead at major AI companies, passionate about inclusive technology.',
      avatar: '/images/team/marcus-johnson.jpg',
    },
    {
      name: 'Dr. Sarah Patel',
      role: 'Lead Data Scientist',
      bio: 'Specializes in NLP and bias detection algorithms with multiple research papers.',
      avatar: '/images/team/sarah-patel.jpg',
    },
    {
      name: 'David Kim',
      role: 'UX Research Lead',
      bio: 'Expert in inclusive design and user experience research.',
      avatar: '/images/team/david-kim.jpg',
    },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in open and honest communication about our technology and its capabilities.',
    },
    {
      title: 'Inclusivity',
      description: 'Our mission is to make content creation accessible and fair for everyone.',
    },
    {
      title: 'Innovation',
      description: 'We continuously push the boundaries of what's possible in bias detection.',
    },
    {
      title: 'Accountability',
      description: 'We take responsibility for our technology and its impact on society.',
    },
  ];

  return (
    <Box>
      {/* Mission Section */}
      <MissionSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="h5" paragraph>
                To create a world where content is free from bias and accessible to all.
              </Typography>
              <Typography variant="body1" paragraph>
                At Biasbuster, we're committed to developing cutting-edge AI technology that helps
                content creators identify and eliminate bias in their work. Our platform combines
                advanced machine learning with ethical AI principles to ensure fair and inclusive
                content creation.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/mission-illustration.svg"
                alt="Our Mission"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </MissionSection>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          Our Values
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            Our Team
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Meet the experts behind Biasbuster
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <TeamCard>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.bio}
                  </Typography>
                </TeamCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Impact Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          Our Impact
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h3" color="primary" align="center" gutterBottom>
                  1M+
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                  Content Pieces Analyzed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h3" color="primary" align="center" gutterBottom>
                  500+
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                  Organizations Served
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h3" color="primary" align="center" gutterBottom>
                  99%
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                  Customer Satisfaction
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage; 