import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow both authenticated admin calls and scheduled (service role) calls
    let isAdmin = false;
    try {
      const user = await base44.auth.me();
      isAdmin = user?.role === 'admin';
    } catch (_) {
      // Not authenticated — may be a scheduled call, continue as service role
    }

    const body = await req.json().catch(() => ({}));
    const targetEmail = body?.user_email || null;

    // Fetch all students (or a specific one)
    const query = targetEmail ? { user_email: targetEmail } : {};
    const profiles = await base44.asServiceRole.entities.StudentProfile.filter(query);

    if (!profiles || profiles.length === 0) {
      return Response.json({ message: 'No student profiles found', sent: 0 });
    }

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - 6);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const results = [];

    for (const profile of profiles.slice(0, 50)) { // max 50 per run
      try {
        // Get recent analytics
        const analytics = await base44.asServiceRole.entities.LearningAnalytics.filter(
          { user_email: profile.user_email }, '-date', 7
        ).catch(() => []);

        const chatLogs = await base44.asServiceRole.entities.AIChatLog.filter(
          { user_email: profile.user_email }, '-created_date', 20
        ).catch(() => []);

        // Calculate weekly averages
        const avgPoliteness = analytics.length > 0
          ? Math.round(analytics.reduce((a, b) => a + (b.politeness_score || 0), 0) / analytics.length)
          : (profile.politeness_score || 70);
        const avgToxicity = analytics.length > 0
          ? Math.round(analytics.reduce((a, b) => a + (b.toxicity_score || 0), 0) / analytics.length)
          : (profile.toxicity_current || 15);
        const totalAI = analytics.reduce((a, b) => a + (b.ai_interactions || 0), 0);
        const totalReflections = analytics.reduce((a, b) => a + (b.reflections_written || 0), 0);

        // Detect weak areas
        const weakAreas = [];
        if (avgPoliteness < 70) weakAreas.push('Kesantunan Bahasa Digital');
        if (avgToxicity > 30) weakAreas.push('Pengendalian Emosi & Toxicity');
        if ((profile.cultural_sensitivity || 0) < 65) weakAreas.push('Sensitivitas Budaya Lokal');
        if ((profile.ethical_awareness || 0) < 70) weakAreas.push('Kesadaran Etika Komunikasi');
        if (totalReflections < 2) weakAreas.push('Frekuensi Refleksi Diri');

        // Generate AI summary
        const aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Kamu adalah asisten akademik PragmaticsAI. Buat ringkasan laporan progress mingguan untuk mahasiswa.

DATA MINGGU INI:
- Nama: ${profile.user_email}
- Rata-rata Kesantunan: ${avgPoliteness}%
- Rata-rata Toxicity: ${avgToxicity}%
- Sensitivitas Kultural: ${profile.cultural_sensitivity || 65}%
- Kesadaran Etika: ${profile.ethical_awareness || 70}%
- Interaksi AI: ${totalAI}
- Refleksi: ${totalReflections}
- Level: ${profile.level || 'Pemula'}
- XP Terkumpul: ${profile.xp_points || 0}
- Area Lemah: ${weakAreas.join(', ') || 'tidak ada'}

Buat JSON:
- ringkasan_singkat: 2 kalimat ringkasan pencapaian minggu ini
- pencapaian_utama: array 2-3 pencapaian konkret
- area_perhatian: array 2-3 area yang perlu fokus minggu depan
- rekomendasi_aksi: array 3 rekomendasi aksi spesifik yang harus dilakukan
- pesan_motivasi: pesan motivasi singkat 1 kalimat yang menyemangati
- skor_delta: estimasi perubahan skor dari minggu lalu (+/- angka)`,
          response_json_schema: {
            type: 'object',
            properties: {
              ringkasan_singkat: { type: 'string' },
              pencapaian_utama: { type: 'array', items: { type: 'string' } },
              area_perhatian: { type: 'array', items: { type: 'string' } },
              rekomendasi_aksi: { type: 'array', items: { type: 'string' } },
              pesan_motivasi: { type: 'string' },
              skor_delta: { type: 'number' },
            }
          }
        });

        // Save weekly report
        const report = await base44.asServiceRole.entities.WeeklyReport.create({
          user_email: profile.user_email,
          week_start: weekStartStr,
          week_end: weekEndStr,
          pragmatic_score: profile.pragmatic_competence || 70,
          politeness_score: avgPoliteness,
          toxicity_score: avgToxicity,
          cultural_sensitivity: profile.cultural_sensitivity || 65,
          ethical_awareness: profile.ethical_awareness || 70,
          ai_interactions: totalAI,
          modules_completed: profile.total_modules_completed || 0,
          reflections_written: totalReflections,
          score_delta: aiResult.skor_delta || 0,
          achievements: aiResult.pencapaian_utama || [],
          weak_areas: weakAreas,
          recommendations: aiResult.rekomendasi_aksi || [],
          ai_summary: aiResult.ringkasan_singkat,
          is_sent: false,
        });

        // Create dashboard notification
        await base44.asServiceRole.entities.Notification.create({
          recipient_email: profile.user_email,
          title: `📊 Laporan Progress Mingguan — ${weekStartStr}`,
          message: `${aiResult.ringkasan_singkat} ${aiResult.pesan_motivasi}`,
          type: 'info',
          is_read: false,
          action_url: '/analytics',
        });

        // Send email
        const emailBody = `
Halo ${profile.user_email},

Berikut adalah laporan progress mingguan Anda di PragmaticsAI (${weekStartStr} - ${weekEndStr}):

📈 RINGKASAN MINGGU INI
${aiResult.ringkasan_singkat}

✅ PENCAPAIAN UTAMA
${(aiResult.pencapaian_utama || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

📊 SKOR MINGGU INI
- Kesantunan: ${avgPoliteness}%
- Toxicity: ${avgToxicity}%
- Sensitivitas Kultural: ${profile.cultural_sensitivity || 65}%
- Interaksi AI: ${totalAI}x
- Refleksi Ditulis: ${totalReflections}

⚠️ AREA YANG PERLU PERHATIAN
${weakAreas.length > 0 ? weakAreas.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'Tidak ada — pertahankan performamu!'}

🎯 REKOMENDASI UNTUK MINGGU DEPAN
${(aiResult.rekomendasi_aksi || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}

💪 ${aiResult.pesan_motivasi}

Salam,
Tim PragmaticsAI
        `.trim();

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: profile.user_email,
          subject: `📊 Laporan Progress Mingguan PragmaticsAI — ${weekStartStr}`,
          body: emailBody,
          from_name: 'PragmaticsAI',
        });

        // Mark as sent
        await base44.asServiceRole.entities.WeeklyReport.update(report.id, { is_sent: true, sent_at: new Date().toISOString() });

        results.push({ email: profile.user_email, status: 'sent' });
      } catch (err) {
        console.error(`Failed for ${profile.user_email}:`, err.message);
        results.push({ email: profile.user_email, status: 'failed', error: err.message });
      }
    }

    return Response.json({
      message: `Weekly reports processed`,
      total: profiles.length,
      sent: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length,
      results,
    });
  } catch (error) {
    console.error('sendWeeklyReport error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});