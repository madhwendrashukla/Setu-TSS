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

  const isFree = !ref || ref.startsWith('free_');

  // Parse page_blocks to extract custom links/messages if configured by admin
  let customBlocks: any = {};
  if (event.page_blocks) {
    customBlocks = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
  }
  const zoomLink = customBlocks.zoom_link || customBlocks.meeting_link || null;
  const whatsappLink = customBlocks.whatsapp_link || customBlocks.whatsapp_group_link || null;
  const customMessage = customBlocks.success_message || customBlocks.confirmation_message || null;

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-[#13113D]">You&apos;re registered!</h1>
        <p className="mt-2 text-slate-600">
          Your registration for <strong className="text-[#13113D]">{event.title}</strong> is confirmed.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4 py-1">
            <span className="text-slate-500">Event</span>
            <span className="font-medium text-[#13113D] text-right">{event.title}</span>
          </div>
          {ref && (
            <div className="flex justify-between gap-4 py-1 border-t border-slate-200/60 mt-2 pt-2">
              <span className="text-slate-500">{isFree ? 'Registration reference' : 'Payment reference'}</span>
              <span className="font-mono text-xs text-[#13113D] text-right break-all">{ref}</span>
            </div>
          )}
        </div>

        {/* Dynamic Admin-Configured Actions (WhatsApp, Zoom, Custom Message) */}
        {(whatsappLink || zoomLink || customMessage) && (
          <div className="mt-6 p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-left space-y-3">
            {customMessage && (
              <p className="text-sm text-purple-950 font-medium leading-relaxed">{customMessage}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  Join WhatsApp Group
                </a>
              )}
              {zoomLink && (
                <a
                  href={zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#2D8CFF] hover:bg-[#1f7ae0] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                >
                  <i className="fa-solid fa-video text-sm"></i>
                  Join Meeting
                </a>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-slate-600">
          A confirmation has been sent to your registered email address.
          Joining details and updates follow closer to the date.
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
