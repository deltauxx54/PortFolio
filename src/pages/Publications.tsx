import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Share2, X, Check } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  videoUrl?: string;
}

interface PublicationsProps {
  data: any;
  containerVariants: any;
  itemVariants: any;
}

export const Publications: React.FC<PublicationsProps> = ({ data, containerVariants, itemVariants }) => {
  const [selectedPost, setSelectedPost] = useState<Publication | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);

  const sharePost = async (post: Publication) => {
    const url = `${window.location.origin}/publications`;
    const shareData = { title: post.title, text: post.excerpt, url };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setSharedId(post.id);
        setTimeout(() => setSharedId(null), 2500);
      }
    } catch {
      // user cancelled share — do nothing
    }
  };

  return (
    <div className="pt-28 md:pt-40 px-4 md:px-6 pb-32">
      <section className="mb-12 max-w-3xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-12">
          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-display font-bold mb-4">
            Mes <span className="text-gradient">Publications</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Partage de connaissances, expériences et réflexions techniques.
          </motion.p>
        </motion.div>

        {(data.publications || []).length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p className="text-lg">Aucune publication pour le moment.</p>
            <p className="text-sm mt-2">Revenez bientôt !</p>
          </div>
        )}

        <div className="space-y-8">
          {(data.publications || []).map((post: Publication) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#0b0b0b]/60 backdrop-blur-xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-4">
                <img src={data.photoUrl} alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                  referrerPolicy="no-referrer" />
                <div>
                  <div className="font-bold text-sm">{data.name} {data.lastName}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </div>
                </div>
              </div>

              {/* Image / Video */}
              {post.videoUrl ? (
                <div className="w-full aspect-video bg-black cursor-pointer" onClick={() => setSelectedPost(post)}>
                  <video src={post.videoUrl} muted loop autoPlay playsInline
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                </div>
              ) : post.image ? (
                <div className="w-full aspect-video bg-black cursor-pointer" onClick={() => setSelectedPost(post)}>
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                    referrerPolicy="no-referrer" />
                </div>
              ) : null}

              {/* Content */}
              <div className="px-4 pb-2 pt-4">
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{post.excerpt}</p>
                <button onClick={() => setSelectedPost(post)}
                  className="text-xs mt-2 font-semibold"
                  style={{ color: data.colors.primary }}>
                  Lire la suite...
                </button>
              </div>

              {/* Actions — Share ONLY */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                <button
                  onClick={() => sharePost(post)}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 glass rounded-xl"
                >
                  {sharedId === post.id
                    ? <><Check className="w-4 h-4 text-green-400" /> <span className="text-green-400">Lien copié !</span></>
                    : <><Share2 className="w-4 h-4" /> Partager</>
                  }
                </button>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  {post.date}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Post detail modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }}
              className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              {selectedPost.videoUrl ? (
                <div className="w-full h-56 md:h-96 overflow-hidden rounded-t-[2rem] bg-black">
                  <video src={selectedPost.videoUrl} controls autoPlay
                    className="w-full h-full object-contain" />
                </div>
              ) : selectedPost.image ? (
                <div className="w-full h-56 md:h-72 overflow-hidden rounded-t-[2rem]">
                  <img src={selectedPost.image} alt={selectedPost.title}
                    className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ) : null}
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedPost.title}</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {selectedPost.date}
                    </p>
                  </div>
                  <button onClick={() => setSelectedPost(null)}
                    className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{selectedPost.content}</p>
                <button
                  onClick={() => sharePost(selectedPost)}
                  className="mt-6 flex items-center gap-2 text-sm px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Partager cet article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
