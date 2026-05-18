import React from "react";
import { motion } from "motion/react";
import { Download, Github, Linkedin, Twitter } from "lucide-react";

interface FooterProps {
  data: any;
}

const FallbackIcon: React.FC<{ slug: string; platform: string }> = ({ slug, platform }) => {
  const [error, setError] = React.useState(false);
  
  if (error || !slug) {
    return <span className="font-display font-extrabold text-[10px] uppercase text-white">{platform.charAt(0)}</span>;
  }
  
  return (
    <img 
      src={`https://cdn.simpleicons.org/${slug}/white`} 
      alt={platform} 
      className="w-5 h-5 object-contain" 
      onError={() => setError(true)} 
      loading="lazy"
    />
  );
};

export const Footer: React.FC<FooterProps> = ({ data }) => {
  return (
    <footer className="border-t border-white/5 py-16 px-6 pb-32 md:pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="font-display font-bold text-3xl tracking-tighter">NTCB</div>
            <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
              Développeur passionné par l'innovation et l'excellence technique.
            </p>
          </div>

          {/* CV Download */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Mon CV</p>
            <motion.a
              href={data.cvUrl || "/cv.pdf"}
              target="_blank"
              rel="noreferrer"
              download
              whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 30px -10px rgba(168,85,247,0.6)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-gradient-custom px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-purple-500/20 animate-pulse-glow"
            >
              <Download className="w-5 h-5" />
              <span className="tracking-wide">TÉLÉCHARGER MON CV</span>
            </motion.a>
          </div>

            {/* Socials & copyright */}
            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-gray-400">
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

                  return arr.map((social: any, i: number) => {
                    const slug = (social.slug || social.platform || "").toLowerCase().trim();
                    return (
                      <motion.a 
                        key={i} 
                        whileHover={{ y: -3, scale: 1.1, color: "#fff" }} 
                        href={social.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="transition-all p-2 glass rounded-full flex items-center justify-center hover:bg-white/10 w-9 h-9"
                        title={social.platform}
                      >
                        <FallbackIcon slug={slug} platform={social.platform} />
                      </motion.a>
                    );
                  });
                })()}
              </div>
            <div className="text-gray-600 text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} {data.name} {data.lastName}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
