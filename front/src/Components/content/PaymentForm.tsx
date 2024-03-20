import React, { useState } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51OvpnLIVkvYjn5PUUTX7fRFeIMIBBvxX2GgqgFaZmliaIklfQPQ0QPk0C5taSUZ7cdAXd3EEBH98vcDfYGuH6h3g00hAFYcdKx');


const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not initialized yet. Please try again later.');
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message || 'An unexpected error occurred');
      console.error('Stripe error:', error);
    } else {
      console.log('PaymentMethod:', paymentMethod);
      // Send paymentMethod.id to your server for processing
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px auto' }}>
      <CardElement options={{ hidePostalCode: true }} />
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <button type="submit" disabled={!stripe || isLoading} style={{ marginTop: '20px' }}>
        {isLoading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

export default PaymentForm;