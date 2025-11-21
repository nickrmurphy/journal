export function createSafe(onError?: (error: unknown) => void) {
  return function safe<T, D>(fn: () => T, defaultValue: D): T | D {
    try {
      return fn();
    } catch (error) {
      onError?.(error);
      return defaultValue;
    }
  };
}

export const safe = createSafe();
