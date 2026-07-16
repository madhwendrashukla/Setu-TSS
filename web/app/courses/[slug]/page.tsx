import { notFound } from "next/navigation";
import CheckoutCard from "./CheckoutCard";

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
    const course = await getCourse(slug);
    if (!course) notFound();

    return (
        // Styled to read as a continuation of the builder landing pages
        // (/events/[slug]): white ground, faint grid, slate ink, violet accents —
        // the buyer should never feel a seam between the page and the checkout.
        <div className="relative pt-24 pb-20 min-h-screen bg-white text-slate-900 overflow-x-hidden">
            {/* Grid background — same treatment as the event landing pages */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
            }} />
            <div className="relative z-10 max-w-5xl mx-auto px-6 grid gap-10 lg:grid-cols-[1fr_380px]">
                <div>
                    <div className="flex items-center gap-2 mb-5 text-xs font-bold uppercase tracking-widest">
                        <span className="rounded-full bg-accent-violet/10 border border-accent-violet/30 text-accent-blue px-3 py-1">
                            {course.level}
                        </span>
                        {course.category && (
                            <span className="rounded-full bg-accent-violet/10 border border-accent-violet/30 text-accent-blue px-3 py-1">
                                {course.category}
                            </span>
                        )}
                        {course.duration > 0 && (
                            <span className="rounded-full bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1">
                                {course.duration} min
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#0B1120] tracking-[-0.04em] mb-6 leading-tight">
                        {course.title}
                    </h1>
                    {course.fileKey && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={course.fileKey}
                            alt={course.title}
                            className="w-full aspect-video object-cover rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] mb-8"
                        />
                    )}
                    {course.smallDescription && (
                        <p className="text-xl text-slate-600 font-light leading-relaxed mb-8">
                            {course.smallDescription}
                        </p>
                    )}
                    {course.description && (
                        <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-line">
                            {course.description}
                        </div>
                    )}
                    <p className="mt-10 text-sm text-slate-500">
                        Already enrolled?{' '}
                        <a href="/lms/login" className="text-accent-blue font-semibold hover:underline">
                            Log in to the LMS →
                        </a>
                    </p>
                </div>

                <CheckoutCard
                    slug={course.slug}
                    title={course.title}
                    price={course.price}
                />
            </div>
        </div>
    );
}
