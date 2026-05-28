import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Bot, BarChart3,
  FlaskConical, PenLine, TrendingUp, Award, Settings,
  ChevronLeft, Brain, Users, Menu, X, Library, Layers, Globe, Bell,
  Swords, BookMarked, MessageSquare, Lightbulb, BarChart2, Mic, Theater, LogOut, GraduationCap, Database,
  Building2, Key, Shield
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { userRole } from '@/lib/userRole';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', group: null },
  { icon: Shield, label: 'Admin Panel', path: '/admin-panel', group: 'Administrasi', superAdminOnly: true },
  { icon: Building2, label: 'Manajemen Institusi', path: '/institution-setup', group: 'Administrasi', adminOnly: true },
  { icon: GraduationCap, label: 'Dasbor Dosen', path: '/dosen-dashboard', group: 'Administrasi', dosenOnly: true },
  { icon: BookMarked, label: 'Manajemen Kelas', path: '/class-management', group: 'Administrasi', dosenOnly: true },
  { icon: BarChart3, label: 'Analitik Kelas', path: '/lecturer-analytics', group: 'Administrasi', dosenOnly: true },
  { icon: Key, label: 'Bergabung Kelas', path: '/join-class', group: 'Administrasi', studentOnly: true },
  { icon: Layers, label: 'Skenario Belajar', path: '/learning-ecosystem', group: 'Ekosistem' },
  { icon: Globe, label: 'Kearifan Budaya AI', path: '/cultural-wisdom', group: 'Ekosistem' },
  { icon: BookOpen, label: 'Modul Saya', path: '/modules', group: 'Belajar' },
  { icon: Bot, label: 'Asisten AI', path: '/ai-analyzer', group: 'Belajar' },
  { icon: FlaskConical, label: 'Lab Media Sosial', path: '/social-lab', group: 'Belajar' },
  { icon: PenLine, label: 'Jurnal Reflektif', path: '/journal', group: 'Belajar' },
  { icon: Lightbulb, label: 'Belajar Adaptif', path: '/adaptive-learning', group: 'Belajar' },
  { icon: Mic, label: 'AI Pragmatics Tutor', path: '/ai-pragmatics-tutor', group: 'Belajar' },
  { icon: Theater, label: 'Virtual Roleplay Lab', path: '/virtual-roleplay-lab', group: 'Belajar' },
  { icon: Database, label: 'Perpustakaan Etnografi', path: '/ethnography-case-library', group: 'Belajar' },
  { icon: Swords, label: 'Latihan Kasus Budaya', path: '/cultural-case-training', group: 'Belajar' },
  { icon: Globe, label: 'Wisata Budaya Pragmatik', path: '/pragmatic-cultural-tour', group: 'Belajar' },
  { icon: Users, label: 'Kolaborasi Kelompok', path: '/study-group', group: 'Kolaborasi' },
  { icon: MessageSquare, label: 'Forum Komunitas', path: '/community', group: 'Kolaborasi' },
  { icon: Swords, label: 'Tantangan Kelompok', path: '/group-challenge', group: 'Kolaborasi' },
  { icon: BookMarked, label: 'Perpustakaan Kasus', path: '/case-library', group: 'Kolaborasi' },
  { icon: Library, label: 'Kasus Etnografi', path: '/ethnography', group: 'Analitik' },
  { icon: TrendingUp, label: 'Analitik', path: '/analytics', group: 'Analitik' },
  { icon: BarChart2, label: 'Laporan Mingguan', path: '/weekly-report', group: 'Analitik' },
  { icon: Award, label: 'Pencapaian', path: '/achievements', group: 'Analitik' },
  { icon: Bell, label: 'Notifikasi', path: '/notifications', group: null },
  { icon: Settings, label: 'Pengaturan', path: '/settings', group: null },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => setCurrentUser(u)).catch(() => {});
  }, []);

  const handleLogout = () => {
    if (currentUser?.email) userRole.clear(currentUser.email);
    base44.auth.logout('/');
  };

  const isAdmin = currentUser?.email === 'gedepurwana@gmail.com' || currentUser?.role === 'admin';
  const effectiveRole = currentUser ? (userRole.get(currentUser.email) || currentUser.role) : null;
  const isDosen = effectiveRole === 'dosen' || effectiveRole === 'lecturer';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold font-montserrat text-sm">PragmaticsAI</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-7 h-7 rounded-lg hover:bg-secondary items-center justify-center text-muted-foreground"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.filter(item => {
          if (item.superAdminOnly && currentUser?.email !== 'gedepurwana@gmail.com') return false;
          if (item.adminOnly && !isAdmin) return false;
          if (item.dosenOnly && !isDosen && !isAdmin) return false;
          if (item.studentOnly && (isDosen || isAdmin)) return false;
          return true;
        }).map((item, idx, arr) => {
          const isActive = location.pathname === item.path;
          const prevGroup = arr[idx - 1]?.group;
          const showGroupLabel = !collapsed && item.group && item.group !== prevGroup;
          return (
            <React.Fragment key={item.path + item.label}>
              {showGroupLabel && (
                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest px-3 pt-3 pb-1">{item.group}</p>
              )}
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border/20">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-gradient-to-br from-rose-500 to-orange-500' : isDosen ? 'bg-gradient-to-br from-cyan-500 to-teal-600' : 'bg-gradient-to-br from-primary to-accent'}`}>
            {isAdmin ? <Building2 className="w-4 h-4 text-white" /> : isDosen ? <BookOpen className="w-4 h-4 text-white" /> : <GraduationCap className="w-4 h-4 text-white" />}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">{currentUser?.full_name || 'Pengguna'}</p>
              <p className="text-[10px] text-muted-foreground truncate capitalize">{isAdmin ? 'Admin Sistem' : isDosen ? 'Dosen' : 'Mahasiswa'}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors flex-shrink-0" title="Keluar">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 glass rounded-xl flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[260px] bg-sidebar z-50 lg:hidden border-r border-border/20"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-sidebar border-r border-border/20 z-30 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
        <SidebarContent />
      </aside>
    </>
  );
}