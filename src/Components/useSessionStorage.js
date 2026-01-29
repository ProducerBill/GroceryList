import { useState, useEffect } from "react";

function useSessionStorage(key, initialValue) {
  // State to store the value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from session storage by key
      const item = window.sessionStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // useEffect to update session storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      // Convert array/object to string before storing
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]); // Reruns when key or storedValue changes

  return [storedValue, setStoredValue];
}

export default useSessionStorage;
