import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../content/PaymentForm';

const PUBLIC_KEY = "pk_live_51OvpnLIVkvYjn5PUUTX7fRFeIMIBBvxX2GgqgFaZmliaIklfQPQ0QPk0C5taSUZ7cdAXd3EEBH98vcDfYGuH6h3g00hAFYcdKx";

const stripePromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}