import * as React from 'react';
import { SUBS_PACKAGES } from '../util/graphql';
import { Tabs, Tab, Grid, Box, CircularProgress, Typography, Button, Card } from '@mui/material';
import { useQuery } from '@apollo/client';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import PackgesTab from '../components/PackgesTab';
export default function Packages() {
  const {
    loading,
    data
  } = useQuery(SUBS_PACKAGES);

  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const annuallyPackages = data?.allPrices.filter(p => p.recurring.interval === 'year' && p.nickname !== null);
  const monthlyPackages = data?.allPrices.filter(p => p.recurring.interval === 'month' && p.nickname !== null);

  return (
    <Box sx={{ mt : 3 }}>
        <Typography component={'h1'} sx={{textAlign:'center', fontSize:'26px', mb:3, fontWeight:600}}>
            Subscription Plans
        </Typography>

        {loading ? (
        <Box sx={{textAlign: 'center'}}>
            <CircularProgress />
        </Box>
        ) : 
        <TabContext value={value}>
            <TabList onChange={handleChange}  textColor="secondary" indicatorColor="secondary" sx={{ width: 'fit-content', margin: 'auto' }}>
                <Tab label="Annually" value="1" />
                <Tab label="Monthly" value="2" />
            </TabList>
            <TabPanel value="1">
                <PackgesTab PackagesData={annuallyPackages} />
            </TabPanel>
            <TabPanel value="2">
                <PackgesTab PackagesData={monthlyPackages} />
            </TabPanel>
        </TabContext>
        }
    </Box>
  );
}