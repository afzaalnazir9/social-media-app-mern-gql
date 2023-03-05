import React, { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Alert, Box, Button } from "@mui/material";

export default function CheckoutForm() {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const stripe = useStripe();
  const elements = useElements();

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);
    const clientSecret = window.sessionStorage.getItem('clientSecret');
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Box sx={{
        padding: '20px',
        backgroundColor: '#e7e7e7',
        borderRadius: '10px',
        mb:'20px'
      }}>
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        <Button
          sx={{
             marginTop: '20px',
             backgroundColor: (processing || disabled) ? '#ccc' : 'black',
             color: 'white !important',
             border: 0,
             padding: '8px 20px',
             borderRadius: '30px',
          }}
          disabled={processing || disabled || succeeded}
          id="submit"
          type="submit"
        >
          <span id="button-text">
            {processing ? (
              "Processing..."
            ) : (
              "Pay now"
            )}
          </span>
        </Button>
      </Box>

      {error && (
        <Alert severity="info">
          {error}
        </Alert>
      )}
      
      {succeeded && (
      <Alert severity="success">
          Payment succeeded, see the result in your
          <a
            href={`https://dashboard.stripe.com/test/payments`}
          >
            {" "}
            Stripe dashboard.
          </a> Refresh the page to pay again.        
      </Alert>
      )}
    </form>
  );
}