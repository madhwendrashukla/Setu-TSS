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
        <div className="pt-24 pb-20 min-h-screen bg-bg-main">
            <div className="max-w-5xl mx-auto px-6 grid gap-10 lg:grid-cols-[1fr_380px]">
                <div>
                    <div className="flex items-center gap-2 mb-5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        <span className="rounded-full bg-bg-surface border border-functional-border px-2.5 py-0.5">
                            {course.level}
                        </span>
                        {course.category && (
                            <span className="rounded-full bg-bg-surface border border-functional-border px-2.5 py-0.5">
                                {course.category}
                            </span>
                        )}
                        {course.duration > 0 && (
                            <span className="rounded-full bg-bg-surface border border-functional-border px-2.5 py-0.5">
                                {course.duration} min
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-[-0.04em] mb-6">
                        {course.title}
                    </h1>
                    {course.smallDescription && (
                        <p className="text-xl text-text-secondary font-light leading-relaxed mb-8">
                            {course.smallDescription}
                        </p>
                    )}
                    {course.description && (
                        <div className="prose prose-slate max-w-none text-text-secondary whitespace-pre-line">
                            {course.description}
                        </div>
                    )}
                    <p className="mt-10 text-sm text-text-secondary">
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
