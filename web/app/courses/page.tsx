import Link from "next/link";

export const metadata = {
    title: 'Courses | Setu - TheStartupSchool',
    description: 'Live workshops and cohort-based courses for founders. Enroll and learn on The Startup School LMS.',
};

type Course = {
    id: string;
    title: string;
    smallDescription: string | null;
    price: number; // paise
    duration: number;
    level: string;
    category: string | null;
    slug: string;
};

async function getCourses(): Promise<Course[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

const formatPrice = (paise: number) =>
    paise <= 0 ? 'Free' : `₹${(paise / 100).toLocaleString('en-IN')}`;

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div className="pt-24 pb-20 min-h-screen bg-bg-main">
            <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
                <h1 className="text-5xl font-black text-text-primary tracking-[-0.04em] mb-6">
                    Courses & <span className="text-accent-blue">Workshops.</span>
                </h1>
                <p className="text-xl text-text-secondary font-light leading-relaxed max-w-2xl mx-auto">
                    Live, cohort-based programs. Enroll here — learn on our LMS.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {courses.length === 0 ? (
                    <p className="text-center text-text-secondary py-16">
                        New courses are coming soon. Check back shortly.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="group rounded-2xl border border-functional-border bg-white p-6 flex flex-col transition-shadow hover:shadow-lg"
                            >
                                <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                                    <span className="rounded-full bg-bg-surface border border-functional-border px-2.5 py-0.5">
                                        {course.level}
                                    </span>
                                    {course.category && (
                                        <span className="rounded-full bg-bg-surface border border-functional-border px-2.5 py-0.5">
                                            {course.category}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-blue transition-colors">
                                    {course.title}
                                </h2>
                                {course.smallDescription && (
                                    <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
                                        {course.smallDescription}
                                    </p>
                                )}
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-lg font-black text-text-primary">
                                        {formatPrice(course.price)}
                                    </span>
                                    <span className="text-sm font-semibold text-accent-blue">
                                        View course →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
