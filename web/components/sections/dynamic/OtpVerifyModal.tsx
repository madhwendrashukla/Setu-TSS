'use client';

import { useState, useRef, useEffect } from 'react';
import { GuestUser } from '@/hooks/useGuestUser';

interface OtpVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (user: GuestUser) => void;
  prefillEmail?: string;
  eventId?: string;
  ticketTier?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function OtpVerifyModal({ isOpen, onClose, onVerified, prefillEmail, eventId, ticketTier }: OtpVerifyModalProps) {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefillEmail || '');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const lastSentData = useRef<string>('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Debounced Lead Capture
  useEffect(() => {
    if (!isOpen || !eventId) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPhoneValid = phone.replace(/\s/g, '').length >= 10;
    
    if (isEmailValid || isPhoneValid) {
      const payload = {
        name,
        email: isEmailValid ? email : '',
        phone: isPhoneValid ? phone : '',
        eventId,
        ticketTier,
        pendingLeadId
      };
      
      const currentData = JSON.stringify(payload);
      if (currentData === lastSentData.current) return;

      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`${API}/api/payments/capture-lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: currentData,
          });
          const data = await res.json();
          if (data.success && data.id) {
            setPendingLeadId(data.id);
          }
          lastSentData.current = currentData;
        } catch (e) {
          console.error("Failed to capture lead", e);
        }
      }, 1500); // 1.5 second debounce

      return () => clearTimeout(timer);
    }
  }, [name, email, phone, isOpen, eventId, ticketTier, pendingLeadId]);

  useEffect(() => {
    if (!isOpen) {
      setStep('form');
      setError(null);
      setOtp(['', '', '', '', '', '']);
      setPendingLeadId(null);
      lastSentData.current = '';
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('All fields are required.');
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      // Push to CRM Leads table ONLY if it's not an event checkout
      // Event checkouts are automatically synced to CRM via /api/payments/capture-lead
      if (!eventId) {
        fetch(`${API}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || 'Guest Checkout',
            email: email,
            phone: phone,
            source: 'quick_verification'
          })
        }).catch(e => console.error("Failed to capture CRM lead", e));
      }

      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = [...otp];
    digits.forEach((d, i) => { if (i < 6) next[i] = d; });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the full 6-digit OTP.'); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      onVerified({
        name,
        email,
        phone,
        guestToken: data.guestToken,
        verifiedAt: Date.now(),
      });
    } catch (err: any) {
      setError(err.message);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend OTP');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            aria-label="Close verify modal"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-shield-check text-white text-2xl" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {step === 'form' ? 'Quick Verification' : 'Enter Your OTP'}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {step === 'form'
              ? 'No account needed — just verify to proceed'
              : `OTP sent to ${email}`}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <i className="fa-solid fa-circle-exclamation" />
              {error}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="relative">
                  <i className="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    required
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative group w-full mt-2"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm">
                  {loading ? (
                    <><i className="fa-solid fa-circle-notch fa-spin" /> Sending OTP...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane" /> Send OTP to Email</>
                  )}
                </div>
              </button>

              <p className="text-center text-xs text-slate-400 mt-2">
                <i className="fa-solid fa-lock text-[10px] mr-1" />
                Your details are saved locally and used only for this purchase
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                          otpRefs.current[idx - 1]?.focus();
                        }
                      }}
                      className="w-11 h-14 text-center text-2xl font-black border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="relative group w-full"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl blur opacity-60 group-hover:opacity-100 disabled:opacity-20 transition duration-300" />
                <div className="relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-60">
                  {loading ? (
                    <><i className="fa-solid fa-circle-notch fa-spin" /> Verifying...</>
                  ) : (
                    <><i className="fa-solid fa-check-circle" /> Verify & Continue</>
                  )}
                </div>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs text-slate-400 hover:text-slate-600 mr-4"
                >
                  ← Change details
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="text-xs font-semibold text-[#8b5cf6] hover:underline disabled:text-slate-400 disabled:no-underline"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
