import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function gererClic(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    }
    document.addEventListener('mousedown', gererClic);
    return () => document.removeEventListener('mousedown', gererClic);
  }, [onOutside]);

  return ref;
}