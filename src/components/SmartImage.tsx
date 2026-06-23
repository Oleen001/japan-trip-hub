'use client';

import { useEffect, useState } from 'react';
import type { ImageRef } from '@/lib/types';
import { cn } from '@/lib/cn';

type SmartImageProps = {
  image: ImageRef;
  alt: string;
  className?: string;
  /** explicit aspect-ratio CSS value e.g. "16 / 10" — prevents CLS */
  ratio?: string;
};

/**
 * Lazy <img> with onerror fallback per SPEC rule:
 * trip.com -> fallbackUrl (wikimedia) -> hide gracefully.
 * Uses native <img> (not next/image) because fallback-on-error
 * and arbitrary remote hosts are simpler + CLS handled via aspect-ratio.
 */
export function SmartImage({ image, alt, className, ratio }: SmartImageProps) {
  const [src, setSrc] = useState(image.url);
  const [triedFallback, setTriedFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // when the component is reused for a different destination (e.g. the mobile
  // pin card), the image prop changes but state wouldn't — resync on url change
  useEffect(() => {
    setSrc(image.url);
    setTriedFallback(false);
    setLoaded(false);
    setFailed(false);
  }, [image.url]);

  function handleError() {
    if (!triedFallback && image.fallbackUrl) {
      setTriedFallback(true);
      setSrc(image.fallbackUrl);
    } else {
      setFailed(true);
    }
  }

  return (
    <div
      className={cn('relative overflow-hidden', !loaded && !failed && 'img-skeleton', className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center bg-alp-soft text-ink-faint">
          <span className="text-xs">ไม่มีรูป</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
}
