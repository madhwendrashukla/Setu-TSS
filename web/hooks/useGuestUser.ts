'use client';

import { useState, useEffect } from 'react';

export interface GuestUser {
  name: string;
  email: string;
  phone: string;
  guestToken: string; // short-lived OTP-verified token
  verifiedAt: number;
}

const STORAGE_KEY = 'tss_guest_user';

export function useGuestUser() {
  const [guestUser, setGuestUserState] = useState<GuestUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: GuestUser = JSON.parse(raw);
        // Token valid for 30 min (1800000 ms)
        if (Date.now() - parsed.verifiedAt < 1800000) {
          setGuestUserState(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {}
  }, []);

  const setGuestUser = (user: GuestUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setGuestUserState(user);
  };

  const clearGuestUser = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGuestUserState(null);
  };

  const isVerified = !!guestUser && Date.now() - guestUser.verifiedAt < 1800000;

  return { guestUser, setGuestUser, clearGuestUser, isVerified };
}
