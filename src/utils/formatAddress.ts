export const formatCryptoAddress = (address: string): string => {
    if (!address || address.length <= 12) return address;
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };
  