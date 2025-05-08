import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

import { CopyField } from "@/components/CopyField";
import { formatCryptoAddress } from "@/utils/formatAddress";

interface QuoteData {
  paidCurrency: { amount: number; currency: string };
  address: { address: string; uri: string };
  expiryDate: number;
  quoteStatus: string;
  status: string;
}

export default function PayPage() {
  const router = useRouter();
  const { uuid } = router.query;

  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;

    const fetchQuote = async () => {
      try {
        const { data } = await axios.get(
          `https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/summary`
        );

        if (data.status === "EXPIRED") {
          router.push(`/payin/${uuid}/expired`);
        } else if (data.quoteStatus !== "ACCEPTED") {
          router.push(`/payin/${uuid}`);
        } else {
          setQuote(data);
        }
      } catch (err) {
        console.error("Failed to fetch quote:", err);
        setError("Failed to load quote. Please refresh the page or try again.");
      }
    };

    fetchQuote();
  }, [uuid, router]);

  useEffect(() => {
    if (!quote?.expiryDate) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = quote.expiryDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        router.push(`/payin/${uuid}/expired`);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [quote, uuid, router]);

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  if (!quote) {
    return (
      <p className="text-center mt-20 text-black">Loading quote details...</p>
    );
  }

  const currency = quote.paidCurrency.currency;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white m-auto shadow-lg rounded-md p-8 app-container">
      <h1 className="text-2xl font-semibold text-center mb-6 text-black">
        Pay with {currency}
      </h1>

      <div className="mb-4 text-center text-gray-800">
        To complete this payment, send the amount due to the {currency} address
        below.
      </div>

      <CopyField
        label="Amount Due"
        value={quote.paidCurrency.amount.toString()}
      />

      <CopyField
        label={`${currency} Address`}
        value={quote.address.address}
        displayValue={formatCryptoAddress(quote.address.address)}
      />

      <div className="mb-6 text-center">
        <div className="bg-white p-4 rounded-md mt-2 inline-block">
          <QRCode value={quote.address.uri} size={128} />
        </div>
      </div>

      <p className="py-4 px-2 w-full flex justify-between border-y border-gray-300 text-black text-sm">
        <span>Time left to pay:</span>
        <span className="font-semibold">{timeLeft}</span>
      </p>
    </div>
  );
}
