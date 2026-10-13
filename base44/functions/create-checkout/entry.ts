import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Fixed-window rate limiter backed by the admin-only RateLimit entity.
// Each hit is its own row (append-only), so concurrent requests can't overwrite each other's counts.
async function rateLimited(base44, key, max, windowMs) {
  const store = base44.asServiceRole.entities.RateLimit;
  const now = Date.now();
  const bucket = `${key}:${Math.floor(now / windowMs)}`;
  const hits = await store.filter({ key: bucket }, '-created_date', max + 1);
  if (hits.length >= max) return true;
  await store.create({ key: bucket, count: 1, window_start: new Date(now).toISOString() });
  // Occasional best-effort cleanup of rows older than a day.
  if (Math.random() < 0.05) {
    const cutoff = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    store.deleteMany({ window_start: { $lt: cutoff } }).catch(() => {});
  }
  return false;
}

function clientIp(req) {
  // Prefer platform-set headers; x-forwarded-for's first hop can be spoofed by the client.
  const cf = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');
  if (cf) return cf.trim();
  const parts = (req.headers.get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || 'unknown';
}
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 50000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => null);
    const form = body?.form;
    if (!form || typeof form !== 'object') {
      return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const WIX_API_KEY = Deno.env.get("PAYMENTS_BY_WIX_API_KEY");
    const WIX_SITE_ID = Deno.env.get("PAYMENTS_BY_WIX_SITE_ID");
    if (!WIX_API_KEY || !WIX_SITE_ID) {
      console.error('create-checkout: payment credentials not configured');
      return Response.json({ error: "Payments are temporarily unavailable." }, { status: 503 });
    }

    const amount = typeof form.amount === 'number' ? form.amount : Number(String(form.amount ?? '').trim());
    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return Response.json({ error: `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}.` }, { status: 400 });
    }

    const email = str(form.email, 254);
    const firstName = str(form.first_name, 100);
    const lastName = str(form.last_name, 100);
    const phone = str(form.phone, 30);
    const memorialName = str(form.memorial_name, 100);
    if (!EMAIL_RE.test(email) || !firstName) {
      return Response.json({ error: 'A valid name and email are required.' }, { status: 400 });
    }
    const donationType = form.donation_type === 'recurring' ? 'recurring' : 'one_time';
    const frequency = form.recurring_frequency === 'yearly' ? 'yearly' : 'monthly';

    // Throttle: 5 checkout sessions per 10 minutes per IP and per email.
    const windowMs = 10 * 60 * 1000;
    if (await rateLimited(base44, `checkout:ip:${clientIp(req)}`, 5, windowMs) ||
        await rateLimited(base44, `checkout:email:${email.toLowerCase()}`, 5, windowMs)) {
      return Response.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 });
    }

    const priceStr = amount.toFixed(2);
    const returnBaseUrl = Deno.env.get("APP_BASE_URL") || "https://circlesofgivingplatform.base44.app";

    const item: any = {
      name: form.is_memorial && memorialName ? `Donation in memory of ${memorialName}` : "Donation",
      quantity: 1,
      price: priceStr,
    };

    if (donationType === 'recurring') {
      item.subscriptionInfo = {
        subscriptionSettings: {
          frequency: frequency === 'yearly' ? 'YEAR' : 'MONTH',
        },
        title: `Recurring Donation - ${frequency === 'yearly' ? 'Yearly' : 'Monthly'}`,
      };
    }

    const response = await fetch(
      "https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": WIX_API_KEY,
          "wix-site-id": WIX_SITE_ID,
        },
        body: JSON.stringify({
          cart: {
            items: [item],
            customerInfo: { email, firstName, lastName, phone },
          },
          callbackUrls: {
            postFlowUrl: `${returnBaseUrl}/donate`,
            thankYouPageUrl: `${returnBaseUrl}/donate?success=true`,
          },
        }),
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.checkoutSession?.redirectUrl) {
      console.error("Wix checkout construct error:", response.status, data);
      return Response.json({ error: "Failed to create checkout session." }, { status: 502 });
    }

    return Response.json({ redirectUrl: data.checkoutSession.redirectUrl });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
});
