import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * Confirmation page for a NON-LMS purchase.
 *
 * LMS-backed buyers get an account, a credentials email and a course page. A
 * non-LMS buyer — a plain event ticket — previously got a browser `alert()`
 * and nothing else, which is a poor thing to show someone who has just paid.
 *
 * Deliberately shows NO personal data. The only value taken from the URL is
 * the Razorpay payment reference; the event title is looked up server-side
 * from the slug. Echoing a name, email or phone back from the query string
 * would let anyone craft a URL that displays someone else's details.
 */

export const dynamic = 'force-dynamic';

async function getEvent(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/slug/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function RegistrationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;

  const event = await getEvent(slug);
  if (!event) notFound();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-[#13113D]">You&apos;re registered</h1>
        <p className="mt-2 text-slate-600">
          Your payment for <strong className="text-[#13113D]">{event.title}</strong> went through.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4 py-1">
            <span className="text-slate-500">Event</span>
            <span className="font-medium text-[#13113D] text-right">{event.title}</span>
          </div>
          {ref && (
            <div className="flex justify-between gap-4 py-1">
              <span className="text-slate-500">Payment reference</span>
              <span className="font-mono text-xs text-[#13113D] text-right break-all">{ref}</span>
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-600">
          A confirmation has been sent to the email address you verified during checkout.
          Joining details follow closer to the date. Keep the payment reference above if you
          need to contact us about this booking.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/events/${slug}`}
            className="rounded-full bg-[#6B21FB] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#872DFB]"
          >
            Back to the event
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-[#13113D] transition hover:bg-slate-50"
          >
            Browse all events
          </Link>
        </div>
      </div>
    </main>
  );
}
