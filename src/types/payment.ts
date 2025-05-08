type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
type QuoteStatus = "TEMPLATE" | "PENDING" | "ACCEPTED";

export interface CurrencyAmount {
  amount: number;
  currency: string;
}

export interface CryptoAddress {
  address: string;
  qrCodeImageUrl?: string;
}

export interface PaymentSummary {
  uuid: string;
  merchantName: string;
  reference: string;
  originalCurrency: CurrencyAmount;
  paidCurrency: CurrencyAmount;
  address: CryptoAddress;
  status: PaymentStatus;
  quoteStatus: QuoteStatus;
  expiryDate: number; // UNIX timestamp for consistency
  acceptanceExpiryDate: number;
}
