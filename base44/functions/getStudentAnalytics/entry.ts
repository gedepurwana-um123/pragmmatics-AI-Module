import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Student Analytics Aggregator
 * Returns aggregated learning analytics for dashboard:
 * - 7-day trends, competency scores, AI usage, reflection count.
 * Lecturers (role=dosen) can query for specific students.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const targetEmail = (user.role === 'dosen' || user.role === 'admin')
      ? (body.target_email || user.email)
      : user.email;

    // Fetch last 30 days analytics
    const analytics = await base44.entities.LearningAnalytics.filter({ user_email: targetEmail });
    const profile = await base44.entities.StudentProfile.filter({ user_email: targetEmail });
    const aiLogs = await base44.entities.AIChatLog.filter({ user_email: targetEmail });

    // Compute aggregations
    const last7 = analytics
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7)
      .reverse();

    const totalSessions = analytics.reduce((s, a) => s + (a.session_duration_minutes || 0), 0);
    const avgPoliteness = analytics.length
      ? Math.round(analytics.reduce((s, a) => s + (a.politeness_score || 0), 0) / analytics.length)
      : 0;
    const avgToxicity = analytics.length
      ? Math.round(analytics.reduce((s, a) => s + (a.toxicity_score || 0), 0) / analytics.length)
      : 0;
    const flaggedCount = aiLogs.filter(l => l.flagged_for_review).length;

    return Response.json({
      success: true,
      profile: profile?.[0] || null,
      summary: {
        total_sessions_minutes: totalSessions,
        avg_politeness: avgPoliteness,
        avg_toxicity: avgToxicity,
        total_ai_interactions: aiLogs.length,
        flagged_interactions: flaggedCount,
        total_reflections: analytics.reduce((s, a) => s + (a.reflections_written || 0), 0),
      },
      trend_7days: last7.map(a => ({
        date: a.date,
        pragmatic: a.pragmatic_score,
        politeness: a.politeness_score,
        toxicity: a.toxicity_score,
        ai: a.ai_interactions,
        engagement: a.engagement_score,
      })),
      recent_ai_logs: aiLogs
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 10),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});