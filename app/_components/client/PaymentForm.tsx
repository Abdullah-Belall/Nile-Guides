"use client";
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { CLIENT_COLLECTOR_REQ, CONFIRM_BOOK_REQ } from "@/app/_utils/requests/client-requests-hub";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#ae9460",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
    },
  },
};

const PaymentForm = ({ clientSecret, price, orderId }: any) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  async function confirmOrderInDatabase() {
    const response = await CLIENT_COLLECTOR_REQ(CONFIRM_BOOK_REQ, {
      id: orderId,
      data: { paid: +price },
    });
    if (response.done) {
      router.push("/profile");
    }
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Unable to find Card Element");
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name",
          },
        },
      });

      if (error) {
        setError(error.message || "An unexpected error occurred");
      } else if (paymentIntent?.status === "succeeded") {
        confirmOrderInDatabase();
        setPaymentSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred");
    }

    setIsProcessing(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-[350px] mx-auto p-3 bg-maindark rounded-md shadow-md"
    >
      <h3 className="font-bold text-mainlight mt-2 text-lg text-center">Confirm order</h3>
      <p className="my-2 font-semibold text-anotherLight">You are going to pay: ${price}</p>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#fff",
        }}
      >
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="text-maindark bg-mainlight w-full px-7 py-2 text-center mx-auto rounded-md"
        style={{
          cursor: isProcessing ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        {isProcessing ? "Processing..." : "Pay"}
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {paymentSuccess && (
        <div style={{ color: "green", marginTop: "10px" }}>Payment Successful!</div>
      )}
    </form>
  );
};

export default PaymentForm;
