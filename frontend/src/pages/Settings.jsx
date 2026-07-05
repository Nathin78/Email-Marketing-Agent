import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';

export default function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Personalize your workspace and tune how the AI assistant behaves for your campaigns.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account
              </Typography>
              <Stack spacing={2}>
                <TextField label="Full Name" defaultValue="Ava Thompson" fullWidth />
                <TextField label="Email" defaultValue="ava@example.com" fullWidth />
                <TextField label="Company" defaultValue="Northstar Labs" fullWidth />
                <Chip label="Pro Plan" color="secondary" sx={{ width: 'fit-content' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel control={<Switch defaultChecked />} label="Dark mode" />
                <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
                <FormControlLabel control={<Switch />} label="Automated follow-ups" />
                <FormControlLabel control={<Switch defaultChecked />} label="Weekly performance summaries" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Assistant
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel control={<Switch defaultChecked />} label="Use AI suggestions for subject lines" />
                <FormControlLabel control={<Switch defaultChecked />} label="Auto-optimize email tone" />
                <FormControlLabel control={<Switch />} label="Generate A/B test variants" />
                <Typography variant="body2" color="text.secondary">
                  Recommended settings for higher engagement and faster campaign creation.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Integrations
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Mailchimp</Typography>
                  <Chip label="Connected" color="success" />
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">HubSpot CRM</Typography>
                  <Chip label="Pending" />
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Slack alerts</Typography>
                  <Chip label="Enabled" color="secondary" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
