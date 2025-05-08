"use client";

import { useEffect, useState, useCallback } from "react";

interface CountdownTimerProps {
  expiry: string;
  onExpireAction: () => void;
}

export const CountdownTimer = ({
  expiry,
  onExpireAction,
}: CountdownTimerProps) => {
  const getTimeLeft = useCallback((): number => {
    const expirationTime = new Date(expiry).getTime();
    const currentTime = Date.now();
    return Math.max(expirationTime - currentTime, 0);
  }, [expiry]);

  const [timeLeft, setTimeLeft] = useState<number>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpireAction();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeLeft, onExpireAction]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <span>
      {hours > 0 && (
        <span>
          {hours} hour{hours !== 1 ? "s" : ""}{" "}
        </span>
      )}
      {minutes > 0 && (
        <span>
          {minutes} minute{minutes !== 1 ? "s" : ""}{" "}
        </span>
      )}
      <span>
        {seconds} second{seconds !== 1 ? "s" : ""}
      </span>
    </span>
  );
};
