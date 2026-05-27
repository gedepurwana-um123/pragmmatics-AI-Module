import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Learning Analytics Tracker
 * Records daily learning metrics per user including:
 * pragmatic scores, politeness, toxicity, engagement, module access, AI usage.
 * Called after each significant learning event.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      session_duration_minutes = 0,
      modules_accessed = 0,
      ai_interactions = 0,
      reflections_written = 0,
      pragmatic_score,
      politeness_score,
      toxicity_score,
      cultural_sensitivity,
      ethical_awareness,
      quiz_attempts = 0,
      quiz_avg_score,
      engagement_score,
      learning_phase,
    } = body;

    const today = new Date().toISOString().split('T')[0];

    // Check if today's record exists
    const existing = await base44.entities.LearningAnalytics.filter({
      user_email: user.email,
      date: today,
    });

    const analyticsData = {
      user_email: user.email,
      date: today,
      session_duration_minutes,
      modules_accessed,
      ai_interactions,
      reflections_written,
      ...(pragmatic_score !== undefined && { pragmatic_score }),
      ...(politeness_score !== undefined && { politeness_score }),
      ...(toxicity_score !== undefined && { toxicity_score }),
      ...(cultural_sensitivity !== undefined && { cultural_sensitivity }),
      ...(ethical_awareness !== undefined && { ethical_awareness }),
      quiz_attempts,
      ...(quiz_avg_score !== undefined && { quiz_avg_score }),
      ...(engagement_score !== undefined && { engagement_score }),
      ...(learning_phase && { learning_phase }),
    };

    let record;
    if (existing && existing.length > 0) {
      // Accumulate today's record
      const prev = existing[0];
      record = await base44.entities.LearningAnalytics.update(prev.id, {
        session_duration_minutes: (prev.session_duration_minutes || 0) + session_duration_minutes,
        modules_accessed: Math.max(prev.modules_accessed || 0, modules_accessed),
        ai_interactions: (prev.ai_interactions || 0) + ai_interactions,
        reflections_written: (prev.reflections_written || 0) + reflections_written,
        quiz_attempts: (prev.quiz_attempts || 0) + quiz_attempts,
        // Update scores only if provided (take latest value)
        ...(pragmatic_score !== undefined && { pragmatic_score }),
        ...(politeness_score !== undefined && { politeness_score }),
        ...(toxicity_score !== undefined && { toxicity_score }),
        ...(cultural_sensitivity !== undefined && { cultural_sensitivity }),
        ...(ethical_awareness !== undefined && { ethical_awareness }),
        ...(quiz_avg_score !== undefined && { quiz_avg_score }),
        ...(engagement_score !== undefined && { engagement_score }),
        ...(learning_phase && { learning_phase }),
      });
    } else {
      record = await base44.entities.LearningAnalytics.create(analyticsData);
    }

    return Response.json({ success: true, record });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});