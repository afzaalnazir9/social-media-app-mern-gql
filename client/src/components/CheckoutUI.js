import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Box } from "@mui/material";

// const stripePromise = loadStripe("pk_test_...");

export default function CheckoutUI() {
  // const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  // useEffect(() => {
  //   fetch("http://localhost:5000/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const subscriptionId = window.sessionStorage.getItem('subscriptionId');
  //       const clientSecret = window.sessionStorage.getItem('clientSecret');
  //       setSubscriptionId(subscriptionId);
  //       setClientSecret(clientSecret)
  //     });
  // }, []);


// useEffect(() => {
//   const clientSecret = window.sessionStorage.getItem('clientSecret');
//   setClientSecret(clientSecret)
// }, [])

  const appearance = {
    theme: 'flat'
  };
  const options = {
    // clientSecret,
    appearance,
  };

  return (
    <Box sx={{width: "50%", m: 'auto', mt:"50px"}}>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
        {/* {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )} */}
    </Box>
  );
}