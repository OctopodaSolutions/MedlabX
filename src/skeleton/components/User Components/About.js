import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

export default function About() {
  const about = useSelector((state)=>(state.about))
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4,marginTop:'10rem' }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h2" gutterBottom align="center">
          About
        </Typography>

        <Grid container spacing={2}>
          {/* Product Name */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Product Name:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" paragraph>
              MEDLABX
            </Typography>
          </Grid>

          {/* Version */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Software Version:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" paragraph>
              {about['version']}
            </Typography>
          </Grid>

          {/* Product ID */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Product ID:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" paragraph>
              {about['Product Key']}
            </Typography>
          </Grid>

          {/* Date of Expiry */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              License Expiry Date:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" paragraph>
              {about['Expiry Date']}
            </Typography>
          </Grid>

          {/* Date of Installation */}
          {/* <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Installation Date:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" paragraph>
              December 12, 2024
            </Typography>
          </Grid> */}

          {/* Manufacturer */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Manufacturer:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" paragraph>
              Noki Technologies Inc.
            </Typography>
          </Grid>

          {/* Support */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Customer Support:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" paragraph>
              support@nokitechnologies.com
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}