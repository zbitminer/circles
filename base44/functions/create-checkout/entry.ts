import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { form } = await req.json();

    const WIX_API_KEY = Deno.env.get("PAYMENTS_BY_WIX_API_KEY");
    const WIX_SITE_ID = Deno.env.get("PAYMENTS_BY_WIX_SITE_ID");

    if (!WIX_API_KEY || !WIX_SITE_ID) {
      return Response.json({ error: "Payment credentials not configured." }, { status: 500 });
    }

    if (!form.amount || parseFloat(form.amount) < 0.50) {
      return Response.json({ error: "Amount must be at least 0.50." }, { status: 400 });
    }

    const priceStr = parseFloat(form.amount).toFixed(2);
    const origin = req.headers.get("origin") || "https://circlesofgiving.org";

    const item: any = {
      name: form.is_memorial ? `Donation in memory of ${form.memorial_name}` : "Donation",
      quantity: 1,
      price: priceStr,
    };

    if (form.donation_type === 'recurring') {
      item.subscriptionInfo = {
        subscriptionSettings: {
          frequency: form.recurring_frequency === 'yearly' ? 'YEAR' : 'MONTH',
        },
        title: `Recurring Donation - ${form.recurring_frequency === 'yearly' ? 'Yearly' : 'Monthly'}`,
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
            customerInfo: {
              email: form.email,
              firstName: form.first_name,
              lastName: form.last_name,
              phone: form.phone,
            }
          },
          callbackUrls: {
            postFlowUrl: `${origin}/donate`,
            thankYouPageUrl: `${origin}/donate?success=true`,
          },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
        console.error("Wix checkout construct error:", data);
        return Response.json({ error: "Failed to create checkout session." }, { status: 500 });
    }

    return Response.json({ redirectUrl: data.checkoutSession.redirectUrl });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});