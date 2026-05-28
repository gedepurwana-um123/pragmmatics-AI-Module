import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * AI Interaction Analyzer & Logger
 * Analyzes communication text using Cultural Wisdom Engine,
 * stores results in AIChatLog, and updates LearningAnalytics.
 * 
 * This is the central AI processing endpoint for PragmaticsAI.
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
      user_prompt,
      interaction_type = 'analisis',
      module_context = '',
      session_id = `session_${Date.now()}`,
    } = body;

    if (!user_prompt?.trim()) {
      return Response.json({ error: 'user_prompt is required' }, { status: 400 });
    }

    // Call Cultural Wisdom AI Engine
    const aiResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Kamu adalah Cultural Wisdom Recommendation Engine PragmaticsAI.
Analisis komunikasi digital berikut secara komprehensif berdasarkan teori pragmatik dan kearifan budaya lokal Sulawesi Tenggara:

"${user_prompt}"

Konteks interaksi: ${interaction_type}
${module_context ? `Konteks modul: ${module_context}` : ''}

Berikan analisis JSON lengkap.`,
      response_json_schema: {
        type: 'object',
        properties: {
          ai_response: { type: 'string' },
          toxicity_score: { type: 'number' },
          politeness_score: { type: 'number' },
          speech_act: { type: 'string' },
          emotional_tone: { type: 'string' },
          ethical_level: { type: 'string' },
          cultural_recommendation: { type: 'string' },
          reconstructed_text: { type: 'string' },
          scaffolding_level: { type: 'string' },
          pragmatic_analysis: { type: 'string' },
          flagged_for_review: { type: 'boolean' },
        },
      },
    });

    // Store in AIChatLog
    const logEntry = await base44.entities.AIChatLog.create({
      user_email: user.email,
      session_id,
      user_prompt,
      ai_response: aiResult.ai_response || '',
      toxicity_score: aiResult.toxicity_score || 0,
      politeness_score: aiResult.politeness_score || 0,
      speech_act: aiResult.speech_act || 'tidak_terklasifikasi',
      emotional_tone: aiResult.emotional_tone || 'netral',
      cultural_recommendation: aiResult.cultural_recommendation || '',
      scaffolding_level: aiResult.scaffolding_level || 'moderat',
      ethical_level: aiResult.ethical_level || 'Cukup',
      reconstructed_text: aiResult.reconstructed_text || '',
      module_context,
      interaction_type,
      flagged_for_review: aiResult.flagged_for_review || (aiResult.toxicity_score > 60),
    });

    // Update daily analytics
    await base44.entities.LearningAnalytics.filter({ user_email: user.email, date: new Date().toISOString().split('T')[0] })
      .then(async (existing) => {
        const today = new Date().toISOString().split('T')[0];
        if (existing?.length > 0) {
          await base44.entities.LearningAnalytics.update(existing[0].id, {
            ai_interactions: (existing[0].ai_interactions || 0) + 1,
            politeness_score: aiResult.politeness_score,
            toxicity_score: aiResult.toxicity_score,
          });
        } else {
          await base44.entities.LearningAnalytics.create({
            user_email: user.email,
            date: today,
            ai_interactions: 1,
            politeness_score: aiResult.politeness_score,
            toxicity_score: aiResult.toxicity_score,
          });
        }
      }).catch(() => {});

    // Notify lecturer if toxicity is high (>60)
    if ((aiResult.toxicity_score || 0) > 60) {
      const enrollments = await base44.entities.Enrollment.filter({ student_email: user.email, status: 'active' }).catch(() => []);
      if (enrollments?.length > 0) {
        const enr = enrollments[0];
        await base44.entities.Notification.create({
          recipient_email: enr.lecturer_email,
          type: 'alert',
          title: '⚠️ Toksisitas Tinggi Terdeteksi',
          message: `Mahasiswa ${user.email} mendapatkan skor toksisitas ${aiResult.toxicity_score}% dalam interaksi AI. Pertimbangkan intervensi segera.`,
          is_read: false,
          sender_email: 'system@pragmaticsai',
        }).catch(() => {});
      }
    }

    // Update student profile AI count
    await base44.entities.StudentProfile.filter({ user_email: user.email })
      .then(async (profiles) => {
        if (profiles?.length > 0) {
          await base44.entities.StudentProfile.update(profiles[0].id, {
            total_ai_interactions: (profiles[0].total_ai_interactions || 0) + 1,
            politeness_score: aiResult.politeness_score,
            toxicity_current: aiResult.toxicity_score,
          });
        }
      }).catch(() => {});

    return Response.json({
      success: true,
      log_id: logEntry.id,
      analysis: aiResult,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});