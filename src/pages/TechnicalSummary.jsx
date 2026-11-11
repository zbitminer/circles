import { useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const techStack = [
  { layer: 'Frontend', tech: 'React 18 + Vite + Tailwind CSS', note: 'shadcn/ui component library, lucide-react icons, framer-motion transitions' },
  { layer: 'Charts & Maps', tech: 'Recharts + react-leaflet', note: 'Impact dashboards and location maps (OpenStreetMap)' },
  { layer: 'State & Data', tech: 'TanStack React Query + Base44 SDK', note: 'Cursor-based pagination, realtime entity subscriptions' },
  { layer: 'Forms & DnD', tech: 'react-hook-form + @hello-pangea/dnd', note: 'Validated forms; drag-and-drop content reordering in admin' },
  { layer: 'Backend', tech: 'Base44 serverless functions + workflows', note: 'HTTP handlers, scheduled/event triggers, durable waits' },
  { layer: 'Database', tech: 'Base44 entities (document store)', note: '20+ entities with row-level security and field-level access rules' },
  { layer: 'Auth', tech: 'Base44 Auth (email/password, OAuth, MFA)', note: 'Google sign-in, role-based access, optional two-factor' },
  { layer: 'Payments', tech: 'Payments by Wix', note: 'Secure checkout, webhook verification, idempotent grant flow' },
  { layer: 'Integrations', tech: 'Slack Bot + Supabase connectors', note: 'OAuth-managed, automated notifications and data access' },
  { layer: 'AI', tech: 'In-app AI agents + InvokeLLM', note: 'Opportunity matching, request filing, registration assistance' },
  { layer: 'Localization', tech: 'Custom i18n (EN/HE) with RTL', note: 'Full site dictionary, admin panel, RTL layout support' },
  { layer: 'Deployment', tech: 'Base44 hosted + Android WebView', note: 'Published web app; mobile-optimized for Android wrapper' },
];

const entities = [
  'User', 'VolunteerProfile', 'Post', 'Comment', 'Opportunity', 'Event', 'WorkshopInquiry',
  'ShabbatMeal', 'HourLog', 'Badge', 'Review', 'Group', 'GroupMembership', 'Message',
  'SosRequest', 'HealthRequest', 'EventMessage', 'Notification', 'GalleryAlbum', 'GalleryPhoto',
  'CorporateInquiry', 'RateLimit',
];

const backendFunctions = [
  { name: 'create-checkout', purpose: 'Initiates Wix checkout session for donations' },
  { name: 'rsvpEvent', purpose: 'Handles event RSVP toggling and attendee management' },
  { name: 'eventChat', purpose: 'Manages event-specific chat messages' },
  { name: 'enrollWorkshop', purpose: 'Processes workshop enrollment inquiries' },
  { name: 'togglePostLike', purpose: 'Toggles likes on community feed posts' },
  { name: 'toggleFollow', purpose: 'Follow/unfollow volunteer profiles' },
  { name: 'reportPost', purpose: 'Flags posts for moderator review' },
  { name: 'addOpportunityRemark', purpose: 'Adds remarks to opportunity records' },
  { name: 'helpRequestAction', purpose: 'Claims/resolves SOS and health requests' },
  { name: 'manageGroupMembership', purpose: 'Group join/leave/admin operations' },
  { name: 'manageHourLog', purpose: 'Submits and approves volunteer hour logs' },
  { name: 'generateCertificate', purpose: 'Creates volunteer certificate PDFs' },
  { name: 'notifyOpportunity', purpose: 'Sends notifications for new opportunities' },
  { name: 'notifyMatchingOpportunities', purpose: 'Matches profiles to relevant opportunities' },
  { name: 'sendSlackNotification', purpose: 'Posts automated updates to Slack' },
  { name: 'sendAdminAnnouncement', purpose: 'Distributes admin announcements to members' },
  { name: 'submitContactForm', purpose: 'Processes public contact form submissions' },
  { name: 'promptMealReviews', purpose: 'Prompts Shabbat meal reviews after completion' },
  { name: 'listPendingOpportunities', purpose: 'Returns pending opportunities for moderation' },
  { name: 'migrateCategories', purpose: 'Data migration utility for category schema changes' },
  { name: 'publicApi', purpose: 'Public-facing API endpoint for external access' },
];

const workflows = [
  { name: 'Notify Slack on New Event', trigger: 'Entity: Event created', action: 'Posts to #social Slack channel' },
  { name: 'Notify Slack on New Opportunity', trigger: 'Entity: Opportunity created', action: 'Posts to #social Slack channel' },
  { name: 'Notify Users on New Opportunity', trigger: 'Entity: Opportunity created', action: 'Sends in-app notifications' },
  { name: 'Notify Matching Opportunities on Profile Update', trigger: 'Entity: VolunteerProfile updated', action: 'Matches and notifies relevant users' },
  { name: 'Prompt Meal Reviews on Completion', trigger: 'Entity: ShabbatMeal status change', action: 'Sends review prompt to guests' },
];

const aiAgents = [
  { name: 'Opportunity Matcher', role: 'Matches volunteer profiles to giving opportunities', channel: 'In-app conversation' },
  { name: 'Registration Assistant', role: 'Guides new members through sign-up', channel: 'In-app conversation' },
  { name: 'Request Filing Assistant', role: 'Helps members file SOS and health requests', channel: 'In-app conversation' },
];

const securityLayers = [
  'Row-Level Security (RLS) on every entity — owner, role, and condition-based access rules',
  'Role-based access control — admin, moderator, and user roles with scoped permissions',
  'Field-level RLS — sensitive fields (phone, contact details) restricted by visibility settings',
  'Payment verification — webhook JWT verification, idempotent grant, server-side price validation',
  'Moderation tools — post reporting, flagging, and admin review workflow',
  'Rate limiting entity to protect against abuse',
  'MFA support — optional two-factor authentication for app users',
  'OAuth integration security — connector tokens managed via platform, not stored in code',
];

export default function TechnicalSummary() {
  const { localize } = useLanguage();
  const docRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!docRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(docRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('COG-Technical-Summary.pdf');
    } catch (err) {
      console.error(err);
      alert('Could not generate the PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return localize(
    <div className="min-h-screen bg-background">
      {/* Sticky download bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">Circles of Giving — Technical Summary</h1>
            <p className="text-xs text-muted-foreground">Final technical documentation for client</p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow disabled:opacity-60"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Document */}
      <div ref={docRef} className="max-w-4xl mx-auto px-6 py-10 bg-white text-[#141414]">
        {/* Header */}
        <div className="border-b-2 border-[#bd4c0f] pb-6 mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Circles of Giving — Technical Summary</h1>
          <p className="text-sm text-gray-500">Final technical documentation · November 2026</p>
          <p className="text-sm text-gray-500">Live URL: https://circlesofgivingplatform.base44.app</p>
        </div>

        {/* Architecture Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Architecture Overview</h2>
          <p className="text-sm leading-relaxed mb-4 text-gray-700">
            Circles of Giving is a full-stack web application built on the Base44 platform-as-a-service. The frontend is a React single-page application; the backend consists of serverless functions, scheduled/event-driven workflows, and a document-based data layer with granular row-level security. The app is published as a responsive web app and wrapped for Android WebView deployment.
          </p>
          <div className="rounded-xl border border-gray-200 p-4 bg-[#fcfaf8]">
            <p className="text-sm font-semibold mb-2">Request Flow</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Browser → React UI → Base44 SDK → (Entity CRUD / Backend Function / Integration) → Response → UI re-render (React Query cache + realtime subscriptions)
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. Technology Stack</h2>
          <table className="w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-[#fcfaf8]">
                <th className="text-left font-bold p-2 border-b border-gray-200 w-1/4">Layer</th>
                <th className="text-left font-bold p-2 border-b border-gray-200 w-1/3">Technology</th>
                <th className="text-left font-bold p-2 border-b border-gray-200">Notes</th>
              </tr>
            </thead>
            <tbody>
              {techStack.map((t) => (
                <tr key={t.layer} className="border-b border-gray-100 last:border-b-0">
                  <td className="p-2 font-semibold align-top">{t.layer}</td>
                  <td className="p-2 align-top">{t.tech}</td>
                  <td className="p-2 text-gray-700 align-top">{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Data Model */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. Data Model</h2>
          <p className="text-sm leading-relaxed mb-3 text-gray-700">
            The platform uses 22 entities spanning user management, community interaction, volunteer operations, and governance. Each entity is a JSON schema with built-in fields (id, created_date, updated_date, created_by_id) and custom properties.
          </p>
          <div className="flex flex-wrap gap-2">
            {entities.map((e) => (
              <span key={e} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#fcfaf8] border border-[#bd4c0f]/30 text-[#141414]">
                {e}
              </span>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Security Architecture</h2>
          <p className="text-sm leading-relaxed mb-3 text-gray-700">
            Security is enforced at multiple layers, from database access rules to payment verification:
          </p>
          <ul className="text-sm space-y-2 text-gray-700">
            {securityLayers.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-[#bd4c0f] flex-shrink-0">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Backend Functions */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. Backend Functions (21 serverless endpoints)</h2>
          <table className="w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-[#fcfaf8]">
                <th className="text-left font-bold p-2 border-b border-gray-200 w-1/3">Function</th>
                <th className="text-left font-bold p-2 border-b border-gray-200">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {backendFunctions.map((f) => (
                <tr key={f.name} className="border-b border-gray-100 last:border-b-0">
                  <td className="p-2 font-semibold align-top">{f.name}</td>
                  <td className="p-2 text-gray-700 align-top">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Workflows */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. Automated Workflows</h2>
          <p className="text-sm leading-relaxed mb-3 text-gray-700">
            Event-driven and scheduled automations that run without manual intervention:
          </p>
          <table className="w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-[#fcfaf8]">
                <th className="text-left font-bold p-2 border-b border-gray-200">Workflow</th>
                <th className="text-left font-bold p-2 border-b border-gray-200">Trigger</th>
                <th className="text-left font-bold p-2 border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((w) => (
                <tr key={w.name} className="border-b border-gray-100 last:border-b-0">
                  <td className="p-2 font-semibold align-top">{w.name}</td>
                  <td className="p-2 text-gray-700 align-top">{w.trigger}</td>
                  <td className="p-2 text-gray-700 align-top">{w.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* AI Agents */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">7. AI Assistants</h2>
          <p className="text-sm leading-relaxed mb-3 text-gray-700">
            In-app AI agents assist members with key platform actions through conversational interfaces:
          </p>
          <div className="space-y-2">
            {aiAgents.map((a) => (
              <div key={a.name} className="rounded-xl border border-gray-200 p-3">
                <p className="text-sm font-bold">{a.name}</p>
                <p className="text-sm text-gray-700">{a.role}</p>
                <p className="text-xs text-gray-500 mt-1">Channel: {a.channel}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. External Integrations</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-bold mb-1">Slack (Slack Bot connector)</p>
              <p className="text-sm text-gray-700">Automated notifications to the #social channel for new events, opportunities, and community activity. OAuth-managed with chat:write and channel:read scopes.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-bold mb-1">Payments by Wix</p>
              <p className="text-sm text-gray-700">Secure donation checkout with webhook-verified payment confirmation, idempotent access grants, and server-side price validation. Checkout sessions are public; access grants require verified PAID status.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-bold mb-1">Supabase (connector)</p>
              <p className="text-sm text-gray-700">Read-only database access for reporting and external data integration.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-bold mb-1">App MCP Server</p>
              <p className="text-sm text-gray-700">Exposes app data and backend functions to AI clients (ChatGPT, Claude) via an MCP server for external automation and queries.</p>
            </div>
          </div>
        </section>

        {/* Localization */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">9. Localization & Accessibility</h2>
          <ul className="text-sm space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Full English / Hebrew bilingual support with automatic RTL layout switching</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Site-wide dictionary covering all pages, admin panel, and community content</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Accessibility widget: high-contrast mode, link highlighting, readable spacing, pause animations</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Mobile-first responsive design optimized for Android WebView</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Overscroll behavior and text-selection controls tuned for native mobile feel</li>
          </ul>
        </section>

        {/* Deployment */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">10. Deployment & Infrastructure</h2>
          <ul className="text-sm space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Hosted on Base44 — managed hosting, SSL, and automatic scaling</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Published at https://circlesofgivingplatform.base44.app</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Android WebView wrapper for mobile distribution</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Secrets managed via platform secret store (payment keys, connector tokens)</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Realtime entity subscriptions for live updates across connected clients</li>
          </ul>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-xs text-gray-400">
          Circles of Giving — Technical Documentation · November 2026
        </div>
      </div>
    </div>
  );
}