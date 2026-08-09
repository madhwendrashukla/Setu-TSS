/**
 * Does this offering use the LMS?
 *
 * We sell two different things through the same builder page:
 *
 *   LMS-backed (the default, ~95%) — a course. Buying it opens
 *     /courses/<slug>, whose thumbnail and description come from the LMS, and
 *     payment creates an account + enrolment + credentials email.
 *
 *   Non-LMS (~5%) — a plain event or ticket. There is no course page and no
 *     LMS account: the checkout modal collects name/email/phone, verifies the
 *     email by OTP, takes payment, and shows a confirmation.
 *
 * Until now this was decided implicitly by whether a card happened to have a
 * `course_slug`, which an admin could neither see nor set deliberately. It is
 * now an explicit toggle, settable per event and overridable per card.
 *
 * PRECEDENCE — most specific wins:
 *   1. the card's own `uses_lms`
 *   2. the event's `uses_lms`
 *   3. default TRUE
 *
 * Defaulting to true keeps every existing event behaving exactly as before:
 * none of them carry the flag yet, and they are all LMS-backed today.
 */

export interface LmsRoutable {
  uses_lms?: boolean | null;
  course_slug?: string | null;
}

/** Resolve the effective setting for one card. */
export function usesLms(
  card: LmsRoutable | null | undefined,
  event: { uses_lms?: boolean | null } | null | undefined
): boolean {
  if (card && typeof card.uses_lms === 'boolean') return card.uses_lms;
  if (event && typeof event.uses_lms === 'boolean') return event.uses_lms;
  return true;
}

/**
 * Where should the Enroll button go?
 *
 * Returns either the course page to navigate to, or an instruction to open the
 * on-page checkout modal.
 *
 * Note the safety rule: an LMS-backed card with no resolvable course slug
 * falls back to the modal rather than navigating to `/courses/undefined`. That
 * would be a dead end for the buyer, and taking their money on a page that
 * cannot exist is worse than selling it as a plain ticket.
 */
export function resolveCheckoutTarget(
  card: LmsRoutable | null | undefined,
  event: { uses_lms?: boolean | null } | null | undefined,
  eventCourseSlug?: string | null
): { mode: 'course'; slug: string } | { mode: 'modal' } {
  const slug = card?.course_slug || eventCourseSlug || null;
  if (usesLms(card, event) && slug) {
    return { mode: 'course', slug };
  }
  return { mode: 'modal' };
}
