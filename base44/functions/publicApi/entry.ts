import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Entities exposed through the public read-only API, mapped to the fields safe to return.
// Only these entities/fields are ever served — everything else is hidden.
const PUBLIC_ENTITIES = {
  Event: ['id', 'created_date', 'title', 'description', 'date', 'location', 'cause_category', 'capacity', 'image_url', 'status', 'created_by_name'],
  Opportunity: ['id', 'created_date', 'title', 'description', 'organization', 'location', 'cause_category', 'type', 'image_url', 'deadline', 'capacity', 'status', 'created_by_name'],
  ShabbatMeal: ['id', 'created_date', 'host_name', 'date', 'location', 'seats_available', 'dietary_options', 'description', 'is_holiday', 'holiday_name', 'status'],
  SosRequest: ['id', 'created_date', 'title', 'description', 'location', 'cause_category', 'urgency_hours', 'status'],
  HealthRequest: ['id', 'created_date', 'title', 'description', 'location', 'health_category', 'urgency', 'status'],
  Post: ['id', 'created_date', 'author_name', 'author_avatar', 'content', 'image_url', 'comment_count', 'cause_tags', 'status'],
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

function pick(obj, fields) {
  const out = {};
  for (const f of fields) {
    if (obj[f] !== undefined) out[f] = obj[f];
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed. Use GET.' }, { status: 405, headers: CORS });
  }

  try {
    // Optional API-key protection: only enforced if a PUBLIC_API_KEY secret is set.
    const requiredKey = Deno.env.get('PUBLIC_API_KEY');
    if (requiredKey) {
      const provided = req.headers.get('x-api-key');
      if (provided !== requiredKey) {
        return Response.json({ error: 'Invalid or missing API key. Pass it in the "x-api-key" header.' }, { status: 401, headers: CORS });
      }
    }

    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const params = url.searchParams;

    // Discovery: list available resources
    const resource = params.get('entity') || params.get('resource');
    if (!resource) {
      return Response.json({
        message: 'Public read-only API. Pass ?entity=<name> to fetch records.',
        available_entities: Object.keys(PUBLIC_ENTITIES),
        query_params: {
          entity: 'One of the available_entities',
          limit: 'Max records to return (default 50, max 200)',
          skip: 'Records to skip for pagination (default 0)',
          sort: 'Field to sort by, prefix with "-" for descending (e.g. -created_date)',
          id: 'Fetch a single record by id',
          filter: 'JSON object of exact-match filters, e.g. {"status":"active"}',
        },
      }, { status: 200, headers: CORS });
    }

    const fields = PUBLIC_ENTITIES[resource];
    if (!fields) {
      return Response.json({ error: `Unknown entity "${resource}". Available: ${Object.keys(PUBLIC_ENTITIES).join(', ')}` }, { status: 404, headers: CORS });
    }

    const entity = base44.asServiceRole.entities[resource];

    // Single record by id
    const id = params.get('id');
    if (id) {
      const record = await entity.get(id);
      if (!record) {
        return Response.json({ error: 'Record not found' }, { status: 404, headers: CORS });
      }
      return Response.json({ data: pick(record, fields) }, { status: 200, headers: CORS });
    }

    // List with filter / sort / pagination
    const limit = Math.min(parseInt(params.get('limit') || '50', 10) || 50, 200);
    const skip = Math.max(parseInt(params.get('skip') || '0', 10) || 0, 0);
    const sort = params.get('sort') || '-created_date';

    let filter = {};
    const filterRaw = params.get('filter');
    if (filterRaw) {
      try {
        filter = JSON.parse(filterRaw);
      } catch {
        return Response.json({ error: 'Invalid "filter" — must be a JSON object.' }, { status: 400, headers: CORS });
      }
    }

    const records = Object.keys(filter).length > 0
      ? await entity.filter(filter, sort, limit, skip)
      : await entity.list(sort, limit, skip);

    const data = (records || []).map((r) => pick(r, fields));

    return Response.json({
      entity: resource,
      count: data.length,
      limit,
      skip,
      data,
    }, { status: 200, headers: CORS });
  } catch (error) {
    console.error('publicApi error:', error?.message, error);
    return Response.json({ error: error?.message || 'Internal server error' }, { status: 500, headers: CORS });
  }
});