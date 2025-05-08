import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ExpiredPage() {
  const { uuid } = useRouter().query;
  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof uuid === "string") {
      setQuoteId(uuid);
    } else {
      console.error("Invalid UUID or not set yet.");
    }
  }, [uuid]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-md p-14 app-container">
      <div className="expiredIcon mb-4">
        <svg
          className="w-16 h-16 mb-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M12 2a10 10 0 11-10 10A10 10 0 0112 2z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-black text-center mb-4">
        Payment Details Expired
      </h1>
      <p className="text-gray-700 text-center mb-6">
        The payment details for your transaction have expired.
      </p>
    </section>
  );
}
