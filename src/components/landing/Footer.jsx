import React from 'react';
import { Brain, Mail, ExternalLink, ShieldCheck, Copyright } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold font-space text-lg">PragmaticsAI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Modul Pragmatik Digital Terintegrasi AI Chatbot sebagai Adaptive Scaffolding untuk Etika Berbahasa Mahasiswa di Media Sosial.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold font-space text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Dashboard Mahasiswa</li>
              <li>Asisten AI</li>
              <li>Laboratorium Simulasi</li>
              <li>Analitik Pembelajaran</li>
              <li>Jurnal Reflektif</li>
            </ul>
          </div>

          {/* Riset */}
          <div>
            <h4 className="font-semibold font-space text-sm mb-4">Riset & Publikasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Pragmatik Digital</li>
              <li>Etika Komunikasi</li>
              <li>AI dalam Pendidikan</li>
              <li>Etnografi Digital</li>
              <li>Kesantunan Berbahasa</li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold font-space text-sm mb-4">Kontak & Dukungan</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                support@pragmaticsai.id
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                Kolaborasi Akademik
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col gap-6">
          {/* Copyright Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent)]" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Copyright className="w-4 h-4 text-cyan-300" />
                  <p className="text-sm font-bold font-montserrat">Hak Cipta Dilindungi</p>
                </div>
                <p className="text-sm text-white/90 font-medium mb-1">
                  Platform Riset Pendidikan Bahasa Indonesia — USN Kolaka
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70">
                  <span className="font-semibold text-white/80">Pemegang Hak Cipta:</span>
                  <span>Prof. Nur Ihsan Hl</span>
                  <span className="text-white/30">·</span>
                  <span>Dr. Sarmadan</span>
                  <span className="text-white/30">·</span>
                  <span>Dr. Nasruddin</span>
                  <span className="text-white/30">·</span>
                  <span>I Gede Purwana Edi Saputra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2025 PragmaticsAI. Hak Cipta Dilindungi. Platform Riset Pendidikan Bahasa Indonesia USN Kolaka.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Kebijakan Privasi</span>
              <span>Syarat & Ketentuan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}