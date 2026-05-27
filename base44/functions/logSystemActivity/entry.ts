import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * System Activity Logger
 * Logs user actions, AI interactions, and system events to SystemLog entity.
 * Used by frontend to track: auth events, module access, AI usage, admin actions.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    const body = await req.json();
    const { action, category, details, severity = 'info', status = 'success' } = body;

    if (!action || !category) {
      return Response.json({ error: 'action and category are required' }, { status: 400 });
    }

    const validCategories = ['auth', 'module', 'ai_interaction', 'analytics', 'admin', 'error', 'security'];
    if (!validCategories.includes(category)) {
      return Response.json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` }, { status: 400 });
    }

    const logData = {
      user_email: user?.email || 'anonymous',
      action,
      category,
      details: details || '',
      severity,
      status,
      user_agent: req.headers.get('user-agent') || '',
    };

    const log = await base44.asServiceRole.entities.SystemLog.create(logData);

    return Response.json({ success: true, log_id: log.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});