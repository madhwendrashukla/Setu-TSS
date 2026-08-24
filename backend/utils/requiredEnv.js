/**
 * Read a secret from the environment, or refuse to start.
 *
 * 🔴 THIS EXISTS BECAUSE THE CODEBASE USED TO FALL BACK TO LITERALS.
 * Patterns like `process.env.RAZORPAY_KEY_SECRET || 'secret123'` and
 * `process.env.GUEST_TOKEN_SECRET || 'tss_guest_otp_secret_2026'` mean that a
 * missing variable does not break anything — it silently swaps the real secret
 * for one written in the source. On the payment path that is the difference
 * between "signature verification" and "anybody who has read this file can
 * forge a paid order". On the guest-token path it is "anybody can mint a
 * verified-email token".
 *
 * Both variables ARE set in production today, so nothing was exploitable. The
 * danger was the shape: one typo in a .env, one fresh environment, one restore
 * from a partial backup, and the fallback becomes live with no error anywhere.
 *
 * Fail loudly at startup instead. A process that will not boot is a problem
 * somebody fixes in minutes; a process that boots with a known secret is a
 * problem nobody notices.
 */
function requiredEnv(name) {
  const value = process.env[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `[config] ${name} is not set. Refusing to start — this is a secret, and ` +
      `there is deliberately no default. Set it in the backend .env.`
    );
  }
  return value;
}

module.exports = { requiredEnv };
