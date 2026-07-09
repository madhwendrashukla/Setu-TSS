import { redirect } from 'next/navigation';

// The standalone course catalog is deprecated — courses are listed on the
// events page now. Course detail + checkout still live at /courses/[slug]
// (the LMS redirects paid-course visits there; do not remove that route).
export default function CoursesPage() {
    redirect('/events#courses');
}
