import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import CheckoutCard from "./CheckoutCard";
import { courseDescriptionToHtml } from "@/lib/rich-text";

// This route is load-bearing: the LMS's paid-course flow redirects to
// ${WEBSITE_BASE_URL}/courses/${slug} (jj-lms app/api/payment/create-order),
// so the path must stay exactly /courses/[slug].

type Course = {
    id: string;
    title: string;
    smallDescription: string | null;
    description: string | null;
    price: number; // rupees (as stored by the LMS)
    duration: number;
    level: string;
    category: string | null;
    slug: string;
    fileKey: string | null; // full CDN URL of the course thumbnail
};

type PageItem = {
    id: string;
    kind: 'pill' | 'section' | 'included';
    builtin: string | null;
    label: string;
    body: string | null;
    tone: string | null;
};
type PageItems = { pill: PageItem[]; section: PageItem[]; included: PageItem[] };

// Pill colours. A closed map, not free-form CSS from the database — an admin
// picks a tone by name and cannot inject class names into the page.
const TONES: Record<string, string> = {
    violet: 'bg-accent-violet/10 border-accent-violet/30 text-accent-blue',
    slate: 'bg-slate-100 border-slate-200 text-slate-600',
    green: 'bg-green-50 border-green-200 text-green-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
};

// Everything on this page below the title is admin-built (CMS -> Course Page).
// An empty result renders a bare page rather than resurrecting the old
// hardcoded content: deleting a default is a supported action, so silently
// putting it back would make the builder feel broken.
const NO_ITEMS: PageItems = { pill: [], section: [], included: [] };

async function getPageItems(slug: string): Promise<PageItems> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/course-page-items/${encodeURIComponent(slug)}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return NO_ITEMS;
        const data = await res.json();
        return { pill: data.pill ?? [], section: data.section ?? [], included: data.included ?? [] };
    } catch {
        return NO_ITEMS;
    }
}

async function getCourse(slug: string): Promise<Course | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${encodeURIComponent(slug)}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = await getCourse(slug);
    return {
        title: course ? `${course.title} | Setu - TheStartupSchool` : 'Course | Setu - TheStartupSchool',
        description: course?.smallDescription ?? 'Enroll in a Startup School course.',
    };
}


export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [course, items] = await Promise.all([getCourse(slug), getPageItems(slug)]);
    if (!course) {
        noStore();
        notFound();
    }

    const descriptionHtml = courseDescriptionToHtml(course.description);

    return (
        // Styled to read as a continuation of the builder landing pages
        // (/events/[slug]): white ground, faint grid, slate ink, violet accents.
        <div className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden">
            {/* Scoped styling for the rendered rich-text description (no typography plugin installed). */}
            <style dangerouslySetInnerHTML={{ __html: `
                .course-prose{color:#334155;font-size:1.05rem;line-height:1.8}
                .course-prose p{margin:0 0 1.15rem}
                .course-prose h1,.course-prose h2,.course-prose h3{color:#0B1120;font-weight:800;letter-spacing:-0.02em;margin:2rem 0 .9rem;line-height:1.25}
                .course-prose h1{font-size:1.6rem}.course-prose h2{font-size:1.35rem}.course-prose h3{font-size:1.15rem}
                .course-prose ul,.course-prose ol{margin:0 0 1.15rem;padding-left:1.4rem}
                .course-prose ul{list-style:disc}.course-prose ol{list-style:decimal}
                .course-prose li{margin:.35rem 0}
                .course-prose a{color:#7C3AED;font-weight:600;text-decoration:underline}
                .course-prose strong{color:#0B1120;font-weight:700}
                .course-prose blockquote{border-left:3px solid #A855F7;padding-left:1rem;margin:1.2rem 0;color:#475569;font-style:italic;quotes:"\\201C""\\201D""\\2018""\\2019"}
                .course-prose blockquote p:first-of-type::before{content:open-quote}
                .course-prose blockquote p:last-of-type::after{content:close-quote}
                .course-prose code{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:.35rem;padding:.1rem .4rem;font-size:.9em}
                .course-prose pre{background:#0B1120;color:#e2e8f0;border-radius:.75rem;padding:1rem 1.2rem;overflow-x:auto;margin:1.2rem 0}
                .course-prose pre code{background:none;border:0;color:inherit;padding:0}
                .course-prose hr{border:0;border-top:1px solid #e2e8f0;margin:1.6rem 0}
            `}} />

            {/* Grid background — same treatment as the event landing pages */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
            }} />
            {/* Soft violet glow behind the hero */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[600px] z-0"
                style={{ background: 'radial-gradient(closest-side, rgba(168,85,247,0.16), transparent 70%)' }} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 grid gap-12 lg:grid-cols-[1fr_400px]">
                {/* ── Main column ── */}
                <div>
                    {course.category && (
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent-blue">
                            {course.category}
                        </span>
                    )}
                    <h1 className="mt-3 text-4xl md:text-5xl font-black text-[#0B1120] tracking-[-0.04em] leading-[1.05]">
                        {course.title}
                    </h1>
                    {course.smallDescription && (
                        <p className="mt-5 text-xl text-slate-600 font-light leading-relaxed max-w-2xl">
                            {course.smallDescription}
                        </p>
                    )}

                    {/* Pills — admin-built (CMS → Course Page). A `builtin` row
                        renders live course data; anything else renders its own text.
                        A builtin whose data is missing (no duration set) renders
                        nothing rather than an empty pill. */}
                    {items.pill.length > 0 && (
                        <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-wide">
                            {items.pill.map((pill) => {
                                let text: string | null = pill.label;
                                let dot = false;
                                if (pill.builtin === 'level') {
                                    text = course.level || null;
                                    dot = true;
                                } else if (pill.builtin === 'duration') {
                                    // Course.duration is stored in HOURS. It used to read
                                    // "13 hours of content"; shortened to "13 hours" on
                                    // request, 19 Aug.
                                    text = course.duration > 0
                                        ? (course.duration === 1 ? '1 hour' : `${course.duration} hours`)
                                        : null;
                                }
                                if (!text) return null;
                                return (
                                    <span key={pill.id} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border ${TONES[pill.tone ?? 'slate'] ?? TONES.slate}`}>
                                        {dot && <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" />}
                                        {text}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Sections — admin-built, in the order set in the CMS. A
                        `builtin` section renders live course content; anything else
                        renders the admin's own heading and body, which is how a new
                        section (e.g. "Mentors") gets added without a developer.
                        Deleting a section removes it outright — including the
                        thumbnail or the About block. */}
                    {items.section.map((section) => {
                        if (section.builtin === 'thumbnail') {
                            if (!course.fileKey) return null;
                            return (
                                <div key={section.id} className="mt-8 rounded-3xl overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(11,17,32,0.12)]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={course.fileKey} alt={course.title} className="w-full aspect-video object-cover" />
                                </div>
                            );
                        }

                        if (section.builtin === 'about') {
                            if (!descriptionHtml) return null;
                            return (
                                <div key={section.id} className="mt-12">
                                    <h2 className="text-2xl font-black text-[#0B1120] tracking-tight mb-4">{section.label}</h2>
                                    <div className="course-prose" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                                </div>
                            );
                        }

                        if (section.builtin === 'included') {
                            if (items.included.length === 0) return null;
                            return (
                                <div key={section.id} className="mt-12">
                                    <h2 className="text-2xl font-black text-[#0B1120] tracking-tight mb-5">{section.label}</h2>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                        {items.included.map((row) => (
                                            <li key={row.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3.5">
                                                <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-accent-violet/10 flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                </span>
                                                <span className="text-sm font-medium text-slate-700 leading-snug">{row.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        }

                        // Admin-created section: heading + body. Plain text, rendered
                        // as paragraphs — NOT dangerouslySetInnerHTML, because this
                        // field is typed into a CMS form and rendering it as HTML
                        // would make the sales page an injection surface.
                        if (!section.body) return null;
                        return (
                            <div key={section.id} className="mt-12">
                                <h2 className="text-2xl font-black text-[#0B1120] tracking-tight mb-4">{section.label}</h2>
                                <div className="text-slate-600 leading-relaxed space-y-3">
                                    {section.body.split(/\n{2,}/).map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    <p className="mt-12 text-sm text-slate-500">
                        Already enrolled?{' '}
                        <a href="/lms/login" className="text-accent-blue font-semibold hover:underline">
                            Log in to the LMS →
                        </a>
                    </p>
                </div>

                {/* ── Checkout column ── */}
                <CheckoutCard
                    slug={course.slug}
                    title={course.title}
                    price={course.price}
                />
            </div>
        </div>
    );
}
