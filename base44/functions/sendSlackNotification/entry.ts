import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const DEFAULT_CHANNEL_ID = 'C0CBXKHLXPF'; // #social
const BOT_USERNAME = 'Circles of Giving';
const BOT_ICON_URL = 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/2c865cdfc_logo1.svg';
const APP_URL = 'https://circlesofgivingplatform.base44.app';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const entityType = body.entity_type;
    const entityId = body.entity_id;
    const channelId = body.channel_id || DEFAULT_CHANNEL_ID;

    if (!entityType || !['opportunity', 'event'].includes(entityType)) {
      return Response.json({ error: 'Invalid or missing entity_type (must be "opportunity" or "event")' }, { status: 400 });
    }

    let record = body.data || null;
    if (!record && entityId) {
      if (entityType === 'opportunity') {
        record = await base44.asServiceRole.entities.Opportunity.get(entityId);
      } else {
        record = await base44.asServiceRole.entities.Event.get(entityId);
      }
    }

    if (!record) {
      return Response.json({ error: 'Record not found' }, { status: 404 });
    }

    let text = '';
    let blocks = [];

    if (entityType === 'opportunity') {
      const title = record.title || 'New Volunteer Opportunity';
      const organization = record.organization || record.created_by_name || 'Community Member';
      const category = record.cause_category || 'General';
      const location = record.location || 'Safed, Israel';
      const oppType = record.type ? ` (${record.type})` : '';
      const description = record.description
        ? (record.description.length > 280 ? `${record.description.slice(0, 277)}...` : record.description)
        : 'No description provided.';

      text = `🤝 New Opportunity Posted: *${title}* by ${organization} (${category})`;
      blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🤝 New Volunteer Opportunity: ${title}`.slice(0, 150),
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Category:*\n${category}` },
            { type: 'mrkdwn', text: `*Posted by:*\n${organization}` },
            { type: 'mrkdwn', text: `*Location:*\n${location}${oppType}` },
            ...(record.deadline ? [{ type: 'mrkdwn', text: `*Deadline:*\n${record.deadline}` }] : []),
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: description,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Opportunities',
                emoji: true,
              },
              url: `${APP_URL}/opportunities`,
            },
          ],
        },
      ];
    } else {
      const title = record.title || 'New Community Event';
      const category = record.cause_category || 'Community';
      const location = record.location || 'Safed, Israel';
      const rawDate = record.date || '';
      let formattedDate = rawDate || 'TBD';
      if (rawDate) {
        const parsed = new Date(rawDate);
        if (!Number.isNaN(parsed.getTime())) {
          formattedDate = parsed.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Jerusalem',
          });
        }
      }
      const capacityText = record.capacity ? `${record.capacity} spots` : 'Open';
      const description = record.description
        ? (record.description.length > 280 ? `${record.description.slice(0, 277)}...` : record.description)
        : 'Join us for this upcoming community event!';

      text = `📅 New Event Created: *${title}* on ${formattedDate} at ${location}`;
      blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📅 New Community Event: ${title}`.slice(0, 150),
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*When:*\n${formattedDate}` },
            { type: 'mrkdwn', text: `*Location:*\n${location}` },
            { type: 'mrkdwn', text: `*Category:*\n${category}` },
            { type: 'mrkdwn', text: `*Capacity:*\n${capacityText}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: description,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View & RSVP',
                emoji: true,
              },
              url: `${APP_URL}/events`,
            },
          ],
        },
      ];
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');

    const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        channel: channelId,
        username: BOT_USERNAME,
        icon_url: BOT_ICON_URL,
        text,
        blocks,
      }),
      signal: AbortSignal.timeout(10000),
    });

    const slackData = await slackRes.json();
    if (!slackData.ok) {
      if (slackData.error === 'not_in_channel' || slackData.error === 'channel_not_found') {
        return Response.json({
          error: `Slack error (${slackData.error}): Please invite the bot to the target channel if it is private, or verify the channel exists.`,
        }, { status: 400 });
      }
      return Response.json({ error: `Slack API error: ${slackData.error}` }, { status: 502 });
    }

    return Response.json({
      ok: true,
      channel: slackData.channel,
      ts: slackData.ts,
    });
  } catch (error) {
    console.error('sendSlackNotification error:', error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}