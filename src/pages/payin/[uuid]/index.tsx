"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import axios from "axios";
import { CountdownTimer } from "@/components/CountdownTimer";
import { QuoteData } from "@/types/quote";

const CURRENCY_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  LTC: "Litecoin",
};

const AcceptQuotePage = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showRedirectMsg, setShowRedirectMsg] = useState(false);
  const [expiryKey, setExpiryKey] = useState(0);

  const CURRENCIES = ["BTC", "ETH", "LTC"];

  // Fetch data once uuid is available
  useEffect(() => {
    if (typeof uuid !== "string") return;

    const fetchQuote = async () => {
      try {
        const res = await api.get(`/pay/${uuid}/summary`);
        setQuoteData(res.data);
      } catch (error) {
        console.error("Failed to fetch quote:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [uuid]);

  // Redirect when quote is accepted
  useEffect(() => {
    if (quoteData?.quoteStatus === "ACCEPTED") {
      setShowRedirectMsg(true);
      setTimeout(() => {
        router.push(`/payin/${quoteData.uuid}/pay`);
      }, 2000);
    }
  }, [quoteData, router]);

  // Handle currency update
  const handleCurrencyChange = async (currency: string) => {
    if (typeof uuid !== "string" || !currency) return;

    setIsUpdating(true);

    try {
      const response = await api.put(`/pay/${uuid}/update/summary`, {
        currency,
        payInMethod: "crypto",
      });

      setQuoteData(response.data);
      setExpiryKey((prev) => prev + 1);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Currency update failed:", error.response?.data);
        alert(
          `Currency update failed: ${
            error.response?.data.message || error.message
          }`
        );
      } else {
        console.error("Unexpected error:", error);
        alert("Unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle quote confirmation
  const handleConfirm = async () => {
    if (typeof uuid !== "string" || isConfirming) return;

    setIsConfirming(true);

    try {
      await api.put(`/pay/${uuid}/accept/summary`, { successUrl: "no_url" });
      router.push(`/payin/${uuid}/pay`);
    } catch (error) {
      console.error("Failed to confirm quote:", error);
      alert("Error confirming quote.");
    } finally {
      setIsConfirming(false);
    }
  };

  // Handle quote expiry
  const handleQuoteExpiry = () => {
    console.log("Timer expired — restarting countdown");
    setExpiryKey((prev) => prev + 1);
  };

  // Loading or error state rendering
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading quote...
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Could not load quote. Please check the UUID.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-md p-8 m-auto app-container">
      <div className="bg-white rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-3 text-black">
          {quoteData.merchantDisplayName}
        </h1>
        <p className="mb-8 text-black amount">
          <span className="currValue">{quoteData.displayCurrency.amount} </span>
          <span className="currr">{quoteData.displayCurrency.currency}</span>
        </p>
        <p className="mb-8">
          <span className="font-medium text-gray-800">Reference:</span>
          <span className="font-medium text-black">
            <strong>{quoteData.reference}</strong>
          </span>
        </p>

        {(quoteData.status === "PENDING" ||
          quoteData.status === "ACCEPTED") && (
          <>
            <label
              htmlFor="currency"
              className="block mb-1 text-gray-700 text-left"
            >
              Pay with:
            </label>
            <select
              id="currency"
              aria-label="Select payment currency"
              className="w-full mb-4 border-gray-300 border shadow-md text-gray-700 rounded px-3 py-2 pr-2"
              value={quoteData.paidCurrency.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              disabled={isUpdating}
            >
              <option className="text-gray-800" value="">
                Select currency
              </option>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} - {CURRENCY_NAMES[c]}
                </option>
              ))}
            </select>
          </>
        )}

        {quoteData.paidCurrency.amount > 0 && (
          <>
            <p className="py-4 flex justify-between border-t border-gray-300 border-solid">
              <span className="font-medium text-gray-800">Amount due:</span>
              <span className="font-medium text-black">
                <strong>
                  {quoteData.paidCurrency.amount}{" "}
                  {quoteData.paidCurrency.currency}
                </strong>
              </span>
            </p>
            {quoteData.acceptanceExpiryDate && (
              <p className="py-4 mb-4 flex justify-between border-y border-gray-300 border-solid text-gray-800">
                Quoted price expires in:
                <CountdownTimer
                  key={expiryKey}
                  expiry={new Date(
                    quoteData.acceptanceExpiryDate
                  ).toISOString()}
                  onExpireAction={handleQuoteExpiry}
                />
              </p>
            )}
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isConfirming ? "Confirming..." : "Confirm"}
            </button>
          </>
        )}

        {showRedirectMsg && (
          <p className="mt-4 text-green-600">
            This quote has already been accepted. Redirecting to payment page...
          </p>
        )}
      </div>
    </div>
  );
};

export default AcceptQuotePage;
