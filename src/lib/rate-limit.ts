/** Simple in-memory rate limit for serverless-ish runtimes.
 * Best-effort only: resets on cold start, per-instance. Enough for a hackathon demo.
 */

type Bucket = { hits: number[]; };

const buckets = new Map<string, Bucket>();

export function rateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true; remaining: number } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(opts.key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < opts.windowMs);
  if (bucket.hits.length >= opts.limit) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((opts.windowMs - (now - oldest)) / 1000),
    );
    buckets.set(opts.key, bucket);
    return { ok: false, retryAfterSec };
  }
  bucket.hits.push(now);
  buckets.set(opts.key, bucket);
  return { ok: true, remaining: opts.limit - bucket.hits.length };
}

export function clientKeyFromRequest(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
