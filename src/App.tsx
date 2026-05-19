import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { 
  Terminal,
  Settings
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { fetchPortfolio, savePortfolio } from "./lib/api";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Admin } from "./pages/Admin";

// Pages
import { Home } from "./pages/Home";
import { Publications } from "./pages/Publications";

const INITIAL_DATA = {
  name: "NGUEKOUE TEMBAKEM",
  lastName: "CHRISTIAN BENJAMIN",
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  title: "Développeur Junior & Étudiant",
  description: "Architecte de solutions numériques modernes. Spécialisé dans le développement full-stack et la gestion de projets agile. Un profil junior avec une maturité technique et académique exceptionnelle.",
  email: "christianbenjamin137@gmail.com",
  socials: [
    { platform: "GitHub", url: "https://github.com", slug: "github" },
    { platform: "LinkedIn", url: "https://linkedin.com", slug: "linkedin" },
    { platform: "Twitter", url: "https://twitter.com", slug: "twitter" }
  ],
  services: [
    { title: "Développement Web", description: "Création de sites performants et responsives avec React & Next.js.", icon: "Layout" },
    { title: "Applications Mobiles", description: "Développement d'apps natives et hybrides pour iOS et Android.", icon: "Smartphone" },
    { title: "Backend & API", description: "Architecture robuste et sécurisée avec Node.js et bases de données.", icon: "Server" },
    { title: "Consultant", description: "Conseils techniques et accompagnement sur vos projets numériques.", icon: "Coffee" }
  ],
  technologies: [
    { name: "React", slug: "react", color: "#61DAFB" },
    { name: "Python", slug: "python", color: "#3776AB" },
    { name: "Laravel", slug: "laravel", color: "#FF2D20" },
    { name: "Django", slug: "django", color: "#092E20" },
    { name: "Supabase", slug: "supabase", color: "#3ECF8E" },
    { name: "Flutter", slug: "flutter", color: "#02569B" },
    { name: "Figma", slug: "figma", color: "#F24E1E" },
    { name: "Stitch", slug: "stitch", color: "#023430" },
    { name: "MySQL", slug: "mysql", color: "#4479A1" }
  ],
  projects: [
    { title: "E-Commerce App", description: "Une boutique en ligne complète avec panier et paiement.", tags: ["React", "Stripe"], image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800", category: "Web", githubUrl: "https://github.com", liveUrl: "https://example.com" },
    { title: "SaaS Dashboard", description: "Tableau de bord de gestion pour entreprises.", tags: ["Next.js", "Tailwind"], image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", category: "Application", githubUrl: "", liveUrl: "" }
  ],
  publications: [
    { 
      id: "1",
      title: "L'importance de l'accessibilité web", 
      date: "12 Mai 2024", 
      excerpt: "Découvrez pourquoi rendre vos applications accessibles est crucial pour l'inclusion numérique.",
      content: "L'accessibilité web ne concerne pas seulement les personnes handicapées...",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      videoUrl: ""
    },
    { 
      id: "2",
      title: "Introduction à Framer Motion", 
      date: "05 Mai 2024", 
      excerpt: "Apprenez à créer des animations fluides et professionnelles dans vos projets React.",
      content: "Framer Motion est une bibliothèque puissante pour React...",
      image: "",
    }
  ],
  aboutStats: [
    { label: "Expérience", value: "Dév Junior", sub: "32 ans de passion & curiosité" },
    { label: "Éducation", value: "Étudiant Actif", sub: "Apprentissage continu" },
    { label: "Gestion", value: "Expert Jira", sub: "Méthodologies Agiles" }
  ],
  colors: {
    primary: "#a855f7",
    secondary: "#ec4899",
    accent: "#f97316",
    bg: "#030303"
  },
  cvUrl: ""
};

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      style={{ 
        perspective: 1200, 
        transformOrigin: "left center",
        transformStyle: "preserve-3d"
      }}
      initial={{ opacity: 0, rotateY: 65, x: "100%" }}
      animate={{ opacity: 1, rotateY: 0, x: 0 }}
      exit={{ opacity: 0, rotateY: -65, x: "-100%" }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
};

const IntroLoader: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.7, duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onFinish}
      className="fixed inset-0 z-[999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 bg-purple-500 animate-pulse" />
      
      <div className="flex flex-col items-center justify-center gap-4 select-none px-4 text-center">
        {/* Name lines */}
        <div className="overflow-hidden flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 max-w-4xl">
          <motion.h1
            initial={{ x: "-120%", opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
            className="whitespace-nowrap text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold uppercase tracking-tighter text-white"
          >
            NGUEKOUÉ
          </motion.h1>
          <motion.h1
            initial={{ x: "120%", opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
            className="whitespace-nowrap text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold uppercase tracking-tighter text-gradient"
          >
            CHRISTIAN
          </motion.h1>
        </div>

        {/* Subtitle / Loader bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col items-center gap-3 mt-6"
        >
          <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">Chargement du Portfolio</span>
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-24 bg-gradient-custom rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function AppContent() {
  const location = useLocation();
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("portfolio_data");
    let parsed = saved ? JSON.parse(saved) : INITIAL_DATA;
    if (parsed && parsed.socials && !Array.isArray(parsed.socials)) {
      const obj = parsed.socials;
      parsed.socials = Object.keys(obj).map(key => ({
        platform: key.charAt(0).toUpperCase() + key.slice(1),
        url: obj[key],
        slug: key === 'twitter' ? 'x' : key
      })).filter(item => item.url);
    }
    return { ...INITIAL_DATA, ...parsed };
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [introLoading, setIntroLoading] = useState(true);

  useEffect(() => {
    if (introLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [introLoading]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Secret activation of the admin access on Christian's own machine (e.g. ?auth_device=christian_key_99)
  useEffect(() => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      localStorage.setItem("device_authorized", "true");
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth_device") === "christian_key_99") {
      localStorage.setItem("device_authorized", "true");
      window.history.replaceState({}, document.title, window.location.pathname);
      alert("🔒 Machine Christian autorisée avec succès pour l'administration !");
    }
  }, []);

  // Secret shortcut: Ctrl+Shift+A → open admin login (works in production too)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        if (window.innerWidth < 1024) return; // block shortcut on mobile/tablet
        if (localStorage.getItem("device_authorized") !== "true") return; // block unauthorized devices
        setShowLogin((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const floatVariants = {
    animate: { y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "christian1234") {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Mot de passe incorrect");
    }
  };

  useEffect(() => {
    localStorage.setItem("portfolio_data", JSON.stringify(data));
  }, [data]);

  // Always load latest data from remote API on startup to bypass stale localStorage
  useEffect(() => {
    const loadRemote = async () => {
      try {
        const remote = await fetchPortfolio();
        if (remote) {
          setData((prev: any) => ({ ...prev, ...remote }));
          localStorage.setItem("portfolio_data", JSON.stringify(remote));
        }
      } catch (e) {
        // ignore
      }
    };
    loadRemote();
  }, []);

  const updateData = (key: string, value: any) => {
    if (key === "RESET") {
      setData(INITIAL_DATA);
      localStorage.removeItem("portfolio_data");
      // try saving reset to remote if available
      savePortfolio(INITIAL_DATA).catch(() => {});
      return;
    }
    setData((prev: any) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("portfolio_data", JSON.stringify(next));
      // fire-and-forget remote save
      savePortfolio(next).catch(() => {});
      return next;
    });
  };

  const updateColor = (key: string, value: string) => {
    setData((prev: any) => {
      const next = { ...prev, colors: { ...prev.colors, [key]: value } };
      localStorage.setItem("portfolio_data", JSON.stringify(next));
      savePortfolio(next).catch(() => {});
      return next;
    });
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: data.colors.bg }}
    >
      <AnimatePresence>
        {introLoading && (
          <IntroLoader 
            onFinish={() => setIntroLoading(false)} 
          />
        )}
      </AnimatePresence>
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-custom z-[120] origin-left" style={{ scaleX }} />
        <div className="fixed top-0 left-0 h-1 bg-white/20 w-full z-[119]" />
        
        <style>{`
          :root {
            --primary: ${data.colors.primary};
            --secondary: ${data.colors.secondary};
            --accent: ${data.colors.accent};
          }
          .text-gradient {
            background: linear-gradient(to r, var(--primary), var(--secondary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .bg-gradient-custom {
            background: linear-gradient(to r, var(--primary), var(--secondary), var(--accent));
          }
          .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>

        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <motion.div 
            animate={{ x: mousePosition.x * 1.5, y: mousePosition.y * 1.5, scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full opacity-20" 
            style={{ backgroundColor: data.colors.primary }}
          />
          <motion.div 
            animate={{ x: -mousePosition.x * 1.5, y: -mousePosition.y * 1.5, scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full opacity-20" 
            style={{ backgroundColor: data.colors.secondary }}
          />
        </div>

        <Navbar data={data} isAdmin={isAdmin} setShowLogin={setShowLogin} />

        <AnimatePresence>
          {showLogin && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            >
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass p-10 rounded-[2.5rem] w-full max-w-md border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-display font-bold">Connexion Admin</h2>
                  <button onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-white"><Terminal className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Mot de passe</label>
                    <input 
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Entrez votre mot de passe..."
                    />
                    {loginError && <p className="text-red-500 text-xs font-medium">{loginError}</p>}
                  </div>
                  <button type="submit" className="w-full bg-gradient-custom py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity">Se connecter</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home data={data} containerVariants={containerVariants} itemVariants={itemVariants} floatVariants={floatVariants} /></PageTransition>} />
              <Route path="/publications" element={<PageTransition><Publications data={data} containerVariants={containerVariants} itemVariants={itemVariants} /></PageTransition>} />
              <Route path="/admin" element={isAdmin ? <PageTransition><Admin data={data} updateData={updateData} updateColor={updateColor} handleLogout={() => setIsAdmin(false)} INITIAL_DATA={INITIAL_DATA} /></PageTransition> : <Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer data={data} />
      </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

