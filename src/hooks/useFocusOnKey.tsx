import { useEffect, RefObject } from 'react';

/**
 * Hook to focus a ref element when a specific key is pressed.
 *
 * @param ref - The element ref to focus.
 * @param key - The keyboard key to listen for (e.g., 'F9', 'Enter', 'a').
 */
export function useFocusOnKey<T extends HTMLElement>(
  ref: RefObject<T>,
  key: string
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key && ref.current) {
        ref.current.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ref, key]);
}
