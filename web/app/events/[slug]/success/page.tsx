import Link from 'next/link';
import { notFound } from 'next/navigation';

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

function formatEventDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
    try {
      customBlocks = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
    } catch(e) {}
  }
  const zoomLink = customBlocks.zoom_link || customBlocks.meeting_link || null;
  const whatsappLink = customBlocks.whatsapp_link || customBlocks.whatsapp_group_link || null;
  const customMessage = customBlocks.confirmation_message || customBlocks.success_message || null;
  const formattedDate = formatEventDate(event.start_date);

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#F8FAFC] relative overflow-hidden">
      {/* Subtle background ambient glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden text-center z-10">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6B21FB] via-[#A855F7] to-[#10B981]"></div>

        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100/90 shadow-sm">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/25">
            <svg className="h-6 w-6 sm:h-7 sm:w-7 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          You&apos;re registered!
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Your registration for <strong className="text-slate-900 font-bold">{event.title}</strong> is confirmed.
        </p>

        {/* Event Details Card */}
        <div className="mt-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 p-5 text-left text-sm space-y-3.5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Event</span>
            <div className="font-bold text-slate-900 leading-snug">{event.title}</div>
          </div>

          {(formattedDate || event.venue) && (
            <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-200/70 text-xs">
              {formattedDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs">
                  <i className="fa-regular fa-calendar text-[#6B21FB]"></i>
                  <span>{formattedDate} {event.start_time ? `· ${event.start_time}` : ''}</span>
                </span>
              )}
              {event.venue && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs">
                  <i className="fa-solid fa-location-dot text-rose-500"></i>
                  <span>{event.venue}</span>
                </span>
              )}
            </div>
          )}

          {ref && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2.5 border-t border-slate-200/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isFree ? 'Registration reference' : 'Payment reference'}
              </span>
              <span className="font-mono text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-lg break-all select-all font-semibold">
                {ref}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Admin-Configured Next Steps (WhatsApp, Zoom, Custom Message) */}
        {(whatsappLink || zoomLink || customMessage) && (
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-50/90 to-indigo-50/50 border border-purple-100 text-left space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Important Joining Info
              </h3>
            </div>

            {customMessage && (
              <p className="text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap bg-white/80 p-3.5 rounded-xl border border-purple-100/70">
                {customMessage}
              </p>
            )}

            {(whatsappLink || zoomLink) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_rgba(37,211,102,0.25)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Join WhatsApp Group</span>
                  </a>
                )}
                {zoomLink && (
                  <a
                    href={zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#2D8CFF] hover:bg-[#1f7ae0] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_rgba(45,140,255,0.25)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <i className="fa-solid fa-video text-base"></i>
                    <span>Join Meeting</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Confirmation Email Notice */}
        <p className="mt-6 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          A confirmation has been sent to your registered email address. Joining details and updates follow closer to the date.
        </p>

        {/* Navigation CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/events/${slug}`}
            className="flex-1 rounded-full bg-[#6B21FB] hover:bg-[#5b1bd9] px-6 py-3.5 text-sm font-bold text-white transition-all shadow-[0_8px_20px_rgba(107,33,251,0.25)] hover:-translate-y-0.5 text-center"
          >
            Back to the event
          </Link>
          <Link
            href="/events"
            className="flex-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-800 transition-all shadow-sm hover:-translate-y-0.5 text-center"
          >
            Browse all events
          </Link>
        </div>
      </div>
    </main>
  );
}
