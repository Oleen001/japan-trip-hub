'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icon';

/**
 * Accessible overlay dialog. Portals to <body>, locks scroll, closes on ESC or
 * backdrop click. Desktop = centered card; mobile (<640px) = bottom sheet.
 * Caller owns the body content; `title` renders the sticky header + close button.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 560,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-[1] flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-pop sm:max-h-[88vh] sm:rounded-2xl"
            style={{ maxWidth }}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="flex items-start gap-3 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0 flex-1">
                <div className="text-[17px] font-extrabold leading-tight text-ink">{title}</div>
                {subtitle && (
                  <div className="mt-[3px] text-[12.5px] leading-snug text-ink-soft">{subtitle}</div>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="ปิด"
                className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-full bg-paper text-ink-soft transition-colors hover:bg-paper-sunken hover:text-ink"
              >
                <Icon name="times" size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
