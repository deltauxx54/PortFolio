import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Github, Linkedin, Mail, Briefcase,
  GraduationCap, CheckCircle2, Layout, Smartphone,
  Server, Coffee, Terminal, ExternalLink, Settings,
  Send, User, MessageSquare, Loader2, Twitter
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { sendContactEmail } from "../lib/api";

interface HomeProps {
  data: any;
  containerVariants: any;
  itemVariants: any;
  floatVariants: any;
}

const FallbackIcon: React.FC<{ slug: string; platform: string; color?: string }> = ({ slug, platform, color = "white" }) => {
  const normalized = platform.toLowerCase().trim();
  const iconStyle = { color };

  if (normalized === "linkedin") {
    return <Linkedin className="w-5 h-5" style={iconStyle} />;
  }
  if (normalized === "github") {
    return <Github className="w-5 h-5" style={iconStyle} />;
  }
  if (normalized === "twitter" || normalized === "x") {
    return <Twitter className="w-5 h-5" style={iconStyle} />;
  }
  if (normalized === "email" || normalized === "mail") {
    return <Mail className="w-5 h-5" style={iconStyle} />;
  }

  const [error, setError] = React.useState(false);
  
  if (error || !slug) {
    return <span className="font-display font-extrabold text-[10px] uppercase text-white">{platform.charAt(0)}</span>;
  }
  
  const hexColor = color.replace("#", "");
  return (
    <img 
      src={`https://cdn.simpleicons.org/${slug}/${hexColor}`} 
      alt={platform} 
      className="w-5 h-5 object-contain" 
      onError={() => setError(true)} 
      loading="lazy"
    />
  );
};

export const Home: React.FC<HomeProps> = ({ data, containerVariants, itemVariants, floatVariants }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [selectedTech, setSelectedTech] = useState<any | null>(null);
  const [secretClicks, setSecretClicks] = useState(0);

  React.useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setFormError("");
    const result = await sendContactEmail(form);
    if (result.success) {
      setFormStatus("success");
      setForm({ name: "", email: "", message: "" });
    } else {
      setFormStatus("error");
      setFormError(result.error || "Erreur lors de l'envoi");
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-28 md:pt-36 mb-16 md:mb-40 px-4 md:px-6">
        <div className="grid grid-cols-12 gap-4 sm:gap-10 md:gap-16 lg:gap-20 items-center">
          {/* Text — always LEFT */}
          <motion.div
            variants={containerVariants} initial="hidden" animate="visible"
            className="col-span-7 text-left order-1"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-1 md:gap-2 font-display font-semibold mb-3 md:mb-6 tracking-widest uppercase text-[9px] sm:text-xs"
              style={{ color: data.colors.primary }}
            >
              <span className="w-4 md:w-8 h-[2px]" style={{ backgroundColor: data.colors.primary }} />
              <span className="hidden sm:inline">{data.title}</span>
              <span className="sm:hidden">Dev</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-display font-extrabold mb-3 md:mb-8 tracking-tighter leading-[1.1]"
            >
              {data.name}<br />
              <span style={{ color: data.colors.primary || "#a855f7" }}>{data.lastName}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-[10px] sm:text-sm md:text-lg max-w-3xl mb-4 md:mb-12 leading-relaxed font-light line-clamp-3 md:line-clamp-none"
            >
              {data.description}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 md:gap-6 items-center">
              <motion.a
                href="#contact"
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-custom px-4 py-2 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold flex items-center gap-1 md:gap-3 text-xs md:text-base shadow-2xl shadow-purple-500/20"
              >
                Me contacter <ChevronRight className="w-3 h-3 md:w-5 md:h-5" />
              </motion.a>
              <div className="hidden sm:flex gap-3 md:gap-4">
                <motion.a href={`mailto:${data.email}`}
                  whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-2 md:p-4 glass rounded-xl md:rounded-2xl"
                  title="Email"
                >
                  <Mail className="w-4 h-4 md:w-6 md:h-6" />
                </motion.a>
                {(() => {
                  const socials = data.socials;
                  const arr = Array.isArray(socials) 
                    ? socials 
                    : socials && typeof socials === 'object'
                    ? Object.keys(socials).map(key => ({
                        platform: key.charAt(0).toUpperCase() + key.slice(1),
                        url: socials[key],
                        slug: key === 'twitter' ? 'x' : key
                      })).filter(item => item.url)
                    : [];

                  return arr.map((s: any, i: number) => {
                    const slug = (s.slug || s.platform || "").toLowerCase().trim();
                    return (
                      <motion.a key={i} href={s.url} target="_blank"
                        whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="p-2 md:p-4 glass rounded-xl md:rounded-2xl flex items-center justify-center w-8 h-8 md:w-14 md:h-14"
                        title={s.platform}
                      >
                        <FallbackIcon slug={slug} platform={s.platform} />
                      </motion.a>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </motion.div>

          {/* Photo — always RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="col-span-5 relative order-2 flex justify-end"
          >
            <div className="relative w-full aspect-square max-w-[85px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[384px]">
              <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] blur-3xl opacity-30 animate-pulse"
                style={{ backgroundColor: data.colors.primary }} />
              <motion.div whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative w-full h-full glass rounded-[2rem] md:rounded-[3rem] overflow-hidden border-2 border-white/10"
              >
                {data.photoUrl
                  ? (data.photoUrl.startsWith('data:video') || data.photoUrl.endsWith('.mp4') || data.photoUrl.endsWith('.webm'))
                    ? <video src={data.photoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    : <img src={data.photoUrl} alt={data.name} loading="lazy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  : <div className="w-full h-full flex items-center justify-center bg-white/5"><Settings className="w-8 h-8 md:w-16 md:h-16 text-white/20" /></div>
                }
              </motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="hidden sm:flex absolute -top-4 md:-top-6 -right-4 md:-right-6 glass p-2 md:p-4 rounded-xl md:rounded-2xl border border-white/10"
              >
                <Terminal className="w-5 h-5 md:w-8 md:h-8 text-purple-400" />
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }}
                className="hidden sm:flex absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 glass p-2 md:p-4 rounded-xl md:rounded-2xl border border-white/10"
              >
                <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 text-green-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <motion.section
        id="à-propos"
        variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 mb-16 md:mb-40 px-4 md:px-6"
      >
        {(data.aboutStats || [
          { label: "Expérience", value: "Dév Junior", sub: "32 ans de passion & curiosité", icon: "Briefcase" },
          { label: "Éducation", value: "Étudiant Actif", sub: "Apprentissage continu", icon: "GraduationCap" },
          { label: "Gestion", value: "Expert Jira", sub: "Méthodologies Agiles", icon: "CheckCircle2" }
        ]).map((stat: any, i: number) => {
          // Resolve dynamic Lucide Icon or Emoji
          const IconColor = [data.colors.primary, data.colors.secondary, data.colors.accent][i % 3] || data.colors.primary;
          const iconName = stat.icon || "Briefcase";
          const LucideComponent = (LucideIcons as any)[iconName];

          return (
            <motion.div key={i} variants={itemVariants}
              whileHover={{ y: -15, scale: 1.02, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.5)" }}
              className="glass p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-white/5 -mr-8 -mt-8 md:-mr-16 md:-mt-16 rounded-full blur-3xl" />
              <motion.div variants={floatVariants} animate="animate"
                className="mb-3 md:mb-8 p-2 md:p-4 bg-white/5 w-fit rounded-xl md:rounded-2xl group-hover:rotate-12 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {LucideComponent ? (
                  <LucideComponent className="w-5 h-5 md:w-7 md:h-7" style={{ color: IconColor }} />
                ) : (
                  <span className="text-xl md:text-3xl select-none leading-none">{iconName}</span>
                )}
              </motion.div>
              <p className="text-gray-500 text-[8px] md:text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-sm md:text-3xl font-bold mb-1 leading-tight">{stat.value}</h3>
              <p className="text-gray-400 text-[9px] md:text-base hidden sm:block">{stat.sub}</p>
            </motion.div>
          );
        })}
      </motion.section>

      {/* ── TECHNOLOGIES ── */}
      {data.technologies && data.technologies.length > 0 && (
        <section id="technologies" className="mb-16 md:mb-40 px-4 md:px-6 overflow-hidden">
          <style>{`
            @keyframes orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes counter-orbit { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
          `}</style>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <div className="text-center mb-12 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">Technologies</h2>
              <div className="h-1.5 w-16 md:w-20 bg-gradient-custom mx-auto rounded-full" />
            </div>
            
            <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-2xl mx-auto aspect-square flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/5 bg-black/20" />
              <div className="absolute inset-[18%] rounded-full border border-white/10 border-dashed" />
              <div className="absolute inset-[36%] rounded-full border border-white/5" />
              
              {/* Center Element */}
              <div 
                onClick={() => {
                  setSecretClicks(prev => {
                    const next = prev + 1;
                    if (next >= 5) {
                      localStorage.setItem("device_authorized", "true");
                      alert("🔒 Machine Christian autorisée avec succès ! Vous pouvez maintenant ouvrir la console d'administration avec la combinaison Ctrl + Shift + A.");
                      return 0;
                    }
                    return next;
                  });
                }}
                className="z-10 w-16 h-16 md:w-24 md:h-24 glass rounded-full flex items-center justify-center border-2 cursor-pointer transition-all active:scale-95" 
                style={{ borderColor: data.colors.primary, boxShadow: `0 0 40px ${data.colors.primary}66` }}
                title="Christian Secret Area"
              >
                <Terminal className="w-8 h-8 md:w-12 md:h-12 animate-pulse" style={{ color: data.colors.primary }} />
              </div>

              {/* Orbiting Elements */}
              {data.technologies.map((tech: any, i: number) => {
                const total = data.technologies.length;
                const delay = `-${(i / total) * 40}s`;
                const radius = i % 2 === 0 ? "clamp(140px, 35vw, 320px)" : "clamp(85px, 20vw, 200px)";
                const duration = i % 2 === 0 ? "40s" : "30s";
                
                return (
                  <div key={i} className="absolute top-1/2 left-1/2 w-0 h-0">
                    <div className="absolute top-0 left-0" style={{ animation: `orbit ${duration} linear infinite`, animationDelay: delay }}>
                      <div className="absolute top-0 left-0" style={{ transform: `translateX(${radius})` }}>
                        <div 
                           className="w-12 h-12 md:w-16 md:h-16 -ml-6 -mt-6 md:-ml-8 md:-mt-8 flex items-center justify-center rounded-full glass border border-white/10 group cursor-pointer transition-all hover:scale-125 z-20"
                           style={{ animation: `counter-orbit ${duration} linear infinite`, animationDelay: delay, boxShadow: `0 0 0px ${tech.color}00` }}
                           onClick={() => setSelectedTech(tech)}
                           onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 25px ${tech.color}, inset 0 0 10px ${tech.color}40`; e.currentTarget.style.borderColor = tech.color; e.currentTarget.style.animationPlayState = 'paused'; (e.currentTarget.parentNode?.parentNode as HTMLElement).style.animationPlayState = 'paused'; }}
                           onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.animationPlayState = 'running'; (e.currentTarget.parentNode?.parentNode as HTMLElement).style.animationPlayState = 'running'; }}
                        >
                          <img 
                            src={`https://cdn.simpleicons.org/${tech.slug}/white`} 
                            alt={tech.name} 
                            loading="lazy"
                            className="w-6 h-6 md:w-8 md:h-8 opacity-70 group-hover:opacity-100 transition-opacity"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span className="absolute -bottom-8 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-lg glass opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: tech.color, border: `1px solid ${tech.color}40` }}>
                            {tech.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* ── SERVICES ── */}
      <section id="services" className="mb-16 md:mb-40 px-4 md:px-6">
        <div className="text-center mb-8 md:mb-20">
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-4 tracking-tight">Mes Services</h2>
          <div className="h-1.5 w-20 md:w-24 bg-gradient-custom mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {data.services.map((service: any, i: number) => {
            const Icon = { Layout, Smartphone, Server, Coffee }[service.icon] || Layout;
            return (
              <motion.div key={i} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass p-5 md:p-10 rounded-2xl md:rounded-3xl group hover:bg-white/5 transition-all text-center"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6"
                  style={{ backgroundColor: `${data.colors.primary}15`, color: data.colors.primary }}>
                  <Icon className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <h3 className="text-base md:text-2xl font-bold mb-2 md:mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-xs md:text-base">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── PROJETS ── */}
      <section id="projets" className="mb-16 md:mb-40 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-6xl font-display font-bold mb-4 tracking-tight">Projets Sélectionnés</h2>
            <div className="h-1.5 w-20 md:w-24 bg-gradient-custom rounded-full" />
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-lg">Une immersion dans mes dernières réalisations.</p>
        </div>

        <div className="flex gap-2 md:gap-4 mb-8 md:mb-12 overflow-x-auto pb-2 scrollbar-hide">
          {["Tous", "Web", "Application", "Maquette Figma"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {data.projects
            .filter((p: any) => activeCategory === "Tous" || p.category === activeCategory)
            .map((project: any, i: number) => (
            <motion.div key={i} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative h-[200px] sm:h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl md:rounded-[3rem] overflow-hidden glass border border-white/5"
            >
              <img src={project.image} alt={project.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
                <div className="flex gap-1 md:gap-2 mb-1 md:mb-4 flex-wrap">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 md:px-3 md:py-1 bg-white/10 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <h3 className="text-sm sm:text-xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-4">{project.title}</h3>
                <p className="text-gray-300 line-clamp-2 max-w-sm text-[10px] md:text-base hidden sm:block mb-4">{project.description}</p>
                <div className="flex gap-2 mb-4 md:mb-0">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gradient-custom text-white font-bold text-[10px] md:text-xs rounded-xl shadow-lg hover:scale-105 transition-transform"
                    >
                      Live <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 glass border border-white/10 text-white font-bold text-[10px] md:text-xs rounded-xl shadow-lg hover:scale-105 transition-transform hover:bg-white/10"
                    >
                      <Github className="w-3 h-3 md:w-4 md:h-4" /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="mb-20 px-4 md:px-6">
        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="glass p-8 md:p-16 lg:p-24 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 blur-[120px] -z-10 opacity-20" style={{ backgroundColor: data.colors.primary }} />
          <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 blur-[120px] -z-10 opacity-20" style={{ backgroundColor: data.colors.accent }} />

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left — headline */}
            <div>
              <motion.h2 variants={itemVariants}
                className="text-3xl md:text-5xl lg:text-7xl font-display font-bold mb-6 tracking-tighter"
              >
                Bâtissons l'avenir <br /><span className="text-gradient">ensemble.</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-gray-400 text-base md:text-lg mb-8 font-light leading-relaxed">
                Je suis à la recherche de nouvelles opportunités et collaborations. Mon expertise est à votre service.
              </motion.p>
              <div className="flex flex-col gap-3">
                <motion.a href={`mailto:${data.email}`} whileHover={{ x: 4 }} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Mail className="w-4 h-4" /> {data.email}
                </motion.a>
                {(() => {
                  const socials = data.socials;
                  const arr = Array.isArray(socials) 
                    ? socials 
                    : socials && typeof socials === 'object'
                    ? Object.keys(socials).map(key => ({
                        platform: key.charAt(0).toUpperCase() + key.slice(1),
                        url: socials[key],
                        slug: key === 'twitter' ? 'x' : key
                      })).filter(item => item.url)
                    : [];

                  return arr.map((link: any, i: number) => {
                    const slug = (link.slug || link.platform || "").toLowerCase().trim();
                    return (
                      <motion.a key={i} href={link.url} target="_blank" whileHover={{ x: 4 }}
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <FallbackIcon slug={slug} platform={link.platform} color="#a1a1aa" />
                        </div>
                        <span>{link.platform}</span>
                      </motion.a>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Right — form */}
            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Votre nom" required
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" placeholder="Votre e-mail" required
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
                <textarea placeholder="Votre message..." required rows={5}
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600 resize-none"
                />
              </div>

              {formStatus === "success" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Message envoyé avec succès !
                </motion.div>
              )}
              {formStatus === "error" && <p className="text-red-400 text-sm">{formError}</p>}

              <motion.button type="submit" disabled={formStatus === "sending"}
                whileHover={{ scale: formStatus === "sending" ? 1 : 1.03, y: formStatus === "sending" ? 0 : -3 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-custom py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-2xl disabled:opacity-70 transition-opacity"
              >
                {formStatus === "sending" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>Envoyer le message</span>
                  </span>
                )}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </section>

      {/* ── TECH DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedTech && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTech(null)}
              className="absolute inset-0 bg-[#030303]/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 max-w-lg w-full relative overflow-hidden shadow-2xl z-10"
              style={{
                boxShadow: `0 20px 50px ${selectedTech.color}20`,
                borderColor: `${selectedTech.color}30`
              }}
            >
              {/* Top glowing accent circle */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 -z-10"
                style={{ backgroundColor: selectedTech.color }}
              />

              <div className="flex items-center gap-4 md:gap-6 mb-6">
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] bg-white/5 flex items-center justify-center border transition-all"
                  style={{ borderColor: `${selectedTech.color}40`, boxShadow: `0 0 20px ${selectedTech.color}30` }}
                >
                  <img 
                    src={`https://cdn.simpleicons.org/${selectedTech.slug}/white`} 
                    alt={selectedTech.name} 
                    className="w-8 h-8 md:w-10 md:h-10"
                    style={{ filter: `drop-shadow(0 0 8px ${selectedTech.color})` }}
                  />
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-display font-extrabold tracking-tighter text-white">
                    {selectedTech.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: selectedTech.color }}>
                    Niveau de maîtrise
                  </p>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Compétence</span>
                  <span className="text-sm font-extrabold font-display" style={{ color: selectedTech.color }}>
                    {selectedTech.level || 80}%
                  </span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedTech.level || 80}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full relative"
                    style={{ 
                      backgroundColor: selectedTech.color,
                      boxShadow: `0 0 10px ${selectedTech.color}`
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 mb-8">
                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Description</h4>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                  {selectedTech.description || "Aucune description fournie pour cette technologie."}
                </p>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setSelectedTech(null)}
                className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm uppercase tracking-wider text-white border border-white/10 hover:bg-white/5 transition-all text-center"
              >
                Fermer l'aperçu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
