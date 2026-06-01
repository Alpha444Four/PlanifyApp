import { useEffect, useState } from "react";

/**
 * Simulates async data fetching so pages can showcase real loading states
 * while running in MOCK mode. Swap for a real query hook later.
 */
export function useMockLoading(delay = 700): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return loading;
}
