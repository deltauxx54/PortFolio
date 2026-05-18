import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import {
  Home as HomeIcon, User, Cpu, Briefcase,
  Mail, Newspaper, Settings
} from "lucide-react";

interface NavbarProps {
  data: any;
  isAdmin?: boolean;
  setShowLogin?: (show: boolean) => void;
}

// Admin button is ONLY visible in development mode.
// In production, use the secret shortcut Ctrl+Shift+A to open the login panel.
const IS_DEV = import.meta.env.DEV;

export const Navbar: React.FC<NavbarProps> = ({ data, isAdmin, setShowLogin }) => {
  const location = useLocation();

  const navItems: Array<{ name: string; href: string; icon: JSX.Element }> = [
    { name: "Accueil", href: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "À propos", href: "/#à-propos", icon: <User className="w-5 h-5" /> },
    { name: "Services", href: "/#services", icon: <Cpu className="w-5 h-5" /> },
    { name: "Projets", href: "/#projets", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Publications", href: "/publications", icon: <Newspaper className="w-5 h-5" /> },
  ];

  if (isAdmin) {
    navItems.push({ name: "Administrateur", href: "/admin", icon: <Settings className="w-5 h-5" /> });
  }

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/" && !location.hash;
    if (href.startsWith("/#")) return location.hash === href.substring(1);
    return location.pathname === href;
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass rounded-[2rem] px-6 md:px-8 py-4 border border-white/5">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display font-bold text-xl md:text-2xl tracking-tighter"
            >
              NTCB
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-10 text-sm font-semibold text-gray-400">
            {navItems.map((item) =>
              item.href.startsWith("/#") ? (
                <a key={item.name} href={item.href}
                  className={`hover:text-white transition-all hover:scale-110 ${isActive(item.href) ? "text-white" : ""}`}>
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} to={item.href}
                  className={`hover:text-white transition-all hover:scale-110 ${isActive(item.href) ? "text-white font-bold" : ""}`}>
                  {item.name}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Admin button — DEV only */}
            {IS_DEV && !isAdmin && setShowLogin && (
              <button onClick={() => setShowLogin(true)}
                className="hidden md:inline-block glass p-2 rounded-2xl text-sm font-bold uppercase tracking-widest">
                Administrateur
              </button>
            )}
            {IS_DEV && isAdmin && (
              <Link to="/admin"
                className="hidden md:inline-block glass p-2 rounded-2xl text-sm font-bold uppercase tracking-widest text-purple-400">
                Administrateur
              </Link>
            )}

            <a href="#contact" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${data.colors.primary}66` }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-6 py-2.5 rounded-[1.2rem] text-sm font-bold"
              >
                Me contacter
              </motion.button>
            </a>

            {/* Mobile contact icon */}
            <a href="#contact" className="md:hidden p-2.5 glass rounded-xl">
              <Mail className="w-5 h-5 text-purple-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
        <div className="glass rounded-[2rem] px-4 py-2 flex justify-around items-center border border-white/10 shadow-2xl backdrop-blur-2xl">
          {navItems.filter(item => item.name !== "Administrateur").map((item) => {
            const active = isActive(item.href);
            return (
              <React.Fragment key={item.name}>
                {item.href.startsWith("/#") ? (
                  <a href={item.href}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? "text-white" : "text-gray-500"}`}>
                    <div className={`p-2 rounded-xl transition-all ${active ? "bg-white/10 text-purple-400 scale-110" : "hover:bg-white/5"}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? "opacity-100" : "opacity-0"}`}>{item.name}</span>
                  </a>
                ) : (
                  <Link to={item.href}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? "text-white" : "text-gray-500"}`}>
                    <div className={`p-2 rounded-xl transition-all ${active ? "bg-white/10 text-purple-400 scale-110" : "hover:bg-white/5"}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? "opacity-100" : "opacity-0"}`}>{item.name}</span>
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};
