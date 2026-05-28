import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sliders, Shield, Brain, Globe, MessageSquare, AlertTriangle, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEFAULT_CONFIG = {
  aiTone: 'edukatif',
  strictness: 70,
  feedbackDepth: 'mendalam',
  reflectionIntensity: 65,
  communicationSensitivity: 75,
  emotionalAnalysisLevel: 'moderat',
  toxicityThreshold: 40,
  empathyWeight: 80,
  scaffoldingMode: 'adaptif',
  culturalRecommendation: true,
  pragmaticReasoning: true,
  contextualReasoning: true,
};

const PROMPTS = {
  analyzer: `Anda adalah asisten pragmatik digital yang menganalisis komunikasi berdasarkan teori speech acts, kesantunan, dan kearifan budaya lokal Sulawesi Tenggara (Tolaki, Buton, Muna). Berikan analisis mendalam namun edukatif.`,
  tutor: `Anda adalah tutor pragmatik adaptif. Sesuaikan scaffolding berdasarkan kemampuan mahasiswa. Gunakan pendekatan Socratic dan integrasikan kearifan budaya lokal dalam setiap interaksi.`,
  roleplay: `Anda adalah NPC dalam simulasi pragmatik. Berikan respons realistis sesuai karakter dan konteks budaya. Nilai jawaban mahasiswa berdasarkan kesantunan, ketepatan pragmatik, dan alignment budaya.`,
};

export default function AdminAIGovernance() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activePrompt, setActivePrompt] = useState('analyzer');
  const [prompts, setPrompts] = useState(PROMPTS);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SliderRow = ({ label, key, min = 0, max = 100, color = 'indigo' }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className={`text-xs font-bold text-${color}-600`}>{config[key]}%</span>
      </div>
      <input type="range" min={min} max={max} value={config[key]}
        onChange={e => setConfig(p => ({ ...p, [key]: Number(e.target.value) }))}
        className="w-full h-2 rounded-full accent-indigo-600 cursor-pointer"
      />
    </div>
  );

  const sections = [
    {
      title: 'Kepribadian & Tone AI', icon: Bot, color: 'from-indigo-500 to-violet-600',
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium">Tone Komunikasi AI</label>
            <select value={config.aiTone} onChange={e => setConfig(p => ({ ...p, aiTone: e.target.value }))}
              className="w-full mt-1.5 px-3 py-2 border border-border rounded-lg text-xs bg-background">
              <option value="edukatif">Edukatif & Mendukung</option>
              <option value="formal">Formal & Akademik</option>
              <option value="santai">Santai & Ramah</option>
              <option value="kritis">Kritis & Menantang</option>
              <option value="socratic">Socratic & Reflektif</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Scaffolding Mode</label>
            <select value={config.scaffoldingMode} onChange={e => setConfig(p => ({ ...p, scaffoldingMode: e.target.value }))}
              className="w-full mt-1.5 px-3 py-2 border border-border rounded-lg text-xs bg-background">
              <option value="minimal">Minimal (mandiri)</option>
              <option value="adaptif">Adaptif (otomatis)</option>
              <option value="intensif">Intensif (bimbingan penuh)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Kedalaman Umpan Balik</label>
            <select value={config.feedbackDepth} onChange={e => setConfig(p => ({ ...p, feedbackDepth: e.target.value }))}
              className="w-full mt-1.5 px-3 py-2 border border-border rounded-lg text-xs bg-background">
              <option value="singkat">Singkat & Padat</option>
              <option value="moderat">Moderat</option>
              <option value="mendalam">Mendalam & Komprehensif</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: 'Threshold & Sensitivitas', icon: Sliders, color: 'from-cyan-500 to-blue-600',
      content: (
        <div className="space-y-4">
          <SliderRow label="Ketegasan AI (Strictness)" key="strictness" />
          <SliderRow label="Intensitas Refleksi" key="reflectionIntensity" />
          <SliderRow label="Sensitivitas Komunikasi" key="communicationSensitivity" />
          <SliderRow label="Threshold Toxicity (deteksi di atas nilai ini)" key="toxicityThreshold" color="rose" />
          <SliderRow label="Bobot Analisis Empati" key="empathyWeight" color="emerald" />
        </div>
      )
    },
    {
      title: 'Modul Analisis AI', icon: Brain, color: 'from-violet-500 to-purple-600',
      content: (
        <div className="space-y-3">
          {[
            { key: 'culturalRecommendation', label: 'Rekomendasi Kultural (Tolaki/Buton/Muna)', desc: 'Integrasikan kearifan budaya lokal dalam setiap respons' },
            { key: 'pragmaticReasoning', label: 'Penalaran Pragmatik', desc: 'Analisis speech acts, implikatur, maksim Grice' },
            { key: 'contextualReasoning', label: 'Penalaran Kontekstual', desc: 'Mempertimbangkan konteks sosial dan situasional' },
          ].map(item => (
            <div key={item.key} className="flex items-start justify-between p-3 bg-secondary/30 rounded-xl gap-3">
              <div>
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => setConfig(p => ({ ...p, [item.key]: !p[item.key] }))}
                className={`w-10 h-5 rounded-full transition-all flex-shrink-0 ${config[item.key] ? 'bg-indigo-500' : 'bg-border'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all mx-0.5 ${config[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
          <div>
            <label className="text-xs font-medium">Level Analisis Emosional</label>
            <select value={config.emotionalAnalysisLevel} onChange={e => setConfig(p => ({ ...p, emotionalAnalysisLevel: e.target.value }))}
              className="w-full mt-1.5 px-3 py-2 border border-border rounded-lg text-xs bg-background">
              <option value="dasar">Dasar</option>
              <option value="moderat">Moderat</option>
              <option value="mendalam">Mendalam (NLP lanjutan)</option>
            </select>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold font-montserrat text-indigo-900">AI Governance Control Center</h2>
            <p className="text-xs text-indigo-600">Konfigurasi perilaku, tone, dan threshold seluruh sistem AI platform</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {sections.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold font-montserrat text-sm">{s.title}</h3>
            </div>
            {s.content}
          </motion.div>
        ))}
      </div>

      {/* Prompt Editor */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold font-montserrat">AI System Prompt Editor</h3>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(prompts).map(k => (
            <button key={k} onClick={() => setActivePrompt(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePrompt === k ? 'bg-indigo-100 text-indigo-700' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {k === 'analyzer' ? 'AI Analyzer' : k === 'tutor' ? 'AI Tutor' : 'Roleplay NPC'}
            </button>
          ))}
        </div>
        <textarea
          value={prompts[activePrompt]}
          onChange={e => setPrompts(p => ({ ...p, [activePrompt]: e.target.value }))}
          rows={5}
          className="w-full border border-border rounded-xl px-4 py-3 text-xs bg-secondary/20 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
        />
        <p className="text-[10px] text-muted-foreground mt-2">Prompt ini digunakan sebagai system instruction untuk AI pada konteks yang dipilih.</p>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setConfig(DEFAULT_CONFIG)}>
          <RotateCcw className="w-3.5 h-3.5" />Reset Default
        </Button>
        <Button size="sm" onClick={handleSave} className={`gap-1.5 ${saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
          <Save className="w-3.5 h-3.5" />{saved ? 'Tersimpan!' : 'Simpan Konfigurasi'}
        </Button>
      </div>
    </div>
  );
}