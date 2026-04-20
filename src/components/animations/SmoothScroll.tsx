'use client';

import { useEffect, useRef } from 'react';
import { createLenisInstance } from '@/lib/lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const { cleanup } = createLenisInstance();
    cleanupRef.current = cleanup;

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return <div>{children}</div>;
}
