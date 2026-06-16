import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const MIGRATION_MAP = {
  'Environment': 'Other',
  'Education': 'Learning & Skills Workshops',
  'Health': 'Trauma & Emotional Support',
  'Animals': 'Other',
  'Community': 'Community Events',
  'Elderly': 'Combating Loneliness',
  'Youth': 'Learning & Skills Workshops',
  'Disaster Relief': 'Trauma & Emotional Support',
  'Arts & Culture': 'Learning & Skills Workshops',
  'Other': 'Other',
};

const NEW_CATEGORIES = [
  'Transportation & Escort',
  'Combating Loneliness',
  'Food Preparation & Delivery',
  'Technological Assistance',
  'Maintenance & Home Repair',
  'Learning & Skills Workshops',
  'Trauma & Emotional Support',
  'Community Events',
  'Other',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const results = { events: 0, opportunities: 0, hourLogs: 0, skipped: 0 };

    // Migrate Events
    const events = await base44.asServiceRole.entities.Event.list('-created_date', 500);
    for (const evt of events) {
      if (MIGRATION_MAP[evt.cause_category] && !NEW_CATEGORIES.includes(evt.cause_category)) {
        await base44.asServiceRole.entities.Event.update(evt.id, { cause_category: MIGRATION_MAP[evt.cause_category] });
        results.events++;
      } else {
        results.skipped++;
      }
    }

    // Migrate Opportunities
    const opps = await base44.asServiceRole.entities.Opportunity.list('-created_date', 500);
    for (const opp of opps) {
      if (MIGRATION_MAP[opp.cause_category] && !NEW_CATEGORIES.includes(opp.cause_category)) {
        await base44.asServiceRole.entities.Opportunity.update(opp.id, { cause_category: MIGRATION_MAP[opp.cause_category] });
        results.opportunities++;
      } else {
        results.skipped++;
      }
    }

    // Migrate HourLogs
    const logs = await base44.asServiceRole.entities.HourLog.list('-created_date', 500);
    for (const log of logs) {
      if (MIGRATION_MAP[log.cause_category] && !NEW_CATEGORIES.includes(log.cause_category)) {
        await base44.asServiceRole.entities.HourLog.update(log.id, { cause_category: MIGRATION_MAP[log.cause_category] });
        results.hourLogs++;
      } else {
        results.skipped++;
      }
    }

    return Response.json({ success: true, migrated: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});