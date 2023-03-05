import * as React from 'react';
import { Grid, Box, Button, Card, CircularProgress } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
// import socket from '../util/socketHandler';

const PackgesTab = ({ PackagesData }) => {
  
const [productPriceID, setProductPriceID] = React.useState('')
    const [subscribePackage, { loading }] = useMutation(PACKAGE_INFO);

    const createSubscription = (priceId) => {
      const token = localStorage.getItem('token');
      return fetch('http://localhost:5000/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId: priceId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          window.sessionStorage.setItem('subscriptionId', data.subscriptionId);
          window.sessionStorage.setItem('clientSecret', data.clientSecret);
          window.location.href = '/checkout';
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    
      const createSession = async (priceId) => {
        setProductPriceID(priceId);
        await subscribePackage({
            variables: { priceId }
          })
          .then((result) => {
            // socket.emit('formSubmitted', "helloPriceSubmitted");
            window.location.href = result.data.createSubscriptionCheckoutSession.url;
          })
          .catch((error) => {
            console.error(error);
          });
        };

    return (
        <Grid container spacing={2}>
            {PackagesData.length && PackagesData.map(product => (
                <Grid item xs={4} key={product.id}>
                    <Card variant="outlined" sx={{p:2, textAlign: 'center'}}>
                        <Box component={'h4'}>{product.nickname}</Box>
                        <Box component={'p'} sx={{fontSize:'22px'}}>$ {product.unit_amount / 100}</Box>
                        <Button className="mt-2" onClick={() => createSubscription(product.id)} startIcon={(productPriceID === product.id &&  loading) ? <CircularProgress sx={{ height:'20px !important', width:'20px !important' }}/> : ""} variant="outlined" >SELECT</Button>
                        {/* <Button className="mt-2"  onClick={() => createSession(product.id)} startIcon={(productPriceID === product.id &&  loading) ? <CircularProgress sx={{ height:'20px !important', width:'20px !important' }}/> : ""} variant="outlined" >Buy now</Button> */}
                    </Card>
                </Grid>
            ))}
        </Grid>
  )
}

export default PackgesTab

const PACKAGE_INFO = gql`
  mutation createSubscriptionCheckoutSession($priceId: String!) {
  createSubscriptionCheckoutSession(priceId: $priceId) {
        id
        object
        amount_subtotal
        amount_total
        cancel_url
        customer_details {
          address
          email
          name
          phone
        }
        livemode
        locale
        mode
        payment_link
        payment_status
        status
        submit_type
        subscription
        success_url
        url
  }
}

`;
