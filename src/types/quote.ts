export interface CurrencyAmount {
    amount: number;
    currency: string;
  }
  
  export type QuoteStatus = "PENDING" | "ACCEPTED" | "EXPIRED";
  
  export interface QuoteData {
    uuid: string;
    reference: string;
    quoteStatus: QuoteStatus;
    merchantDisplayName: string;
    displayCurrency: CurrencyAmount;
    paidCurrency: CurrencyAmount;
    status: QuoteStatus;
    acceptanceExpiryDate: string;
  }
  