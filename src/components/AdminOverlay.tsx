import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Terminal, Plus, Trash2 } from "lucide-react";

interface AdminDashboardProps {
  isAdmin: boolean;
  data: any;
  updateData: (key: string, value: any) => void;
  updateColor: (key: string, value: string) => void;
  handleLogout: () => void;
  setShowLogin: (show: boolean) => void;
  INITIAL_DATA: any;
}

export const AdminOverlay: React.FC<AdminDashboardProps> = ({ 
  isAdmin, 
  data, 
  updateData, 
  updateColor, 
  handleLogout, 
  setShowLogin,
  INITIAL_DATA 
}) => {
  return (
    <>
      {/* Admin Toggle / Logout */}
      <div className="fixed bottom-6 right-6 z-[100] flex gap-4">
        {isAdmin ? (
          <button 
            onClick={handleLogout}
            className="glass p-4 rounded-2xl hover:bg-red-500/20 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-red-400"
          >
            <Terminal className="w-4 h-4" />
            Déconnexion
          </button>
        ) : (
          <button 
            onClick={() => setShowLogin(true)}
            className="glass p-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
          >
            <Settings className="w-4 h-4" />
            Admin
          </button>
        )}
      </div>

      {/* Admin Dashboard Overlay */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full z-[90] glass border-l border-white/10 p-8 overflow-y-auto shadow-2xl"
          >
            <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
              <Settings className="w-6 h-6 text-purple-400" /> Tableau de Bord
            </h2>

            <div className="space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 gap-4">
                <div className="glass p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Status</p>
                  <p className="text-2xl font-bold">Admin</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest">Informations Générales</h3>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Photo URL</label>
                  <input 
                    type="text" 
                    value={data.photoUrl} 
                    onChange={(e) => updateData("photoUrl", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Prénom</label>
                  <input 
                    type="text" 
                    value={data.name} 
                    onChange={(e) => updateData("name", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Nom de famille</label>
                  <input 
                    type="text" 
                    value={data.lastName} 
                    onChange={(e) => updateData("lastName", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Titre</label>
                  <input 
                    type="text" 
                    value={data.title} 
                    onChange={(e) => updateData("title", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Description</label>
                  <textarea 
                    value={data.description} 
                    onChange={(e) => updateData("description", e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Email de contact</label>
                  <input 
                    type="email" 
                    value={data.email} 
                    onChange={(e) => updateData("email", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest">Réseaux Sociaux</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">GitHub</label>
                    <input 
                      type="text" 
                      value={data.socials.github} 
                      onChange={(e) => updateData("socials", { ...data.socials, github: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">LinkedIn</label>
                    <input 
                      type="text" 
                      value={data.socials.linkedin} 
                      onChange={(e) => updateData("socials", { ...data.socials, linkedin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Twitter</label>
                    <input 
                      type="text" 
                      value={data.socials.twitter} 
                      onChange={(e) => updateData("socials", { ...data.socials, twitter: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest">Thème & Couleurs</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(["primary", "secondary", "accent", "bg"] as const).map((key) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs text-gray-400 capitalize">{key}</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={data.colors[key]} 
                          onChange={(e) => updateColor(key, e.target.value)}
                          className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                        />
                        <input type="text" value={data.colors[key]} readOnly className="flex-grow bg-white/5 border border-white/10 rounded-xl p-2 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Management */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest">Projets</h3>
                  <button 
                    onClick={() => {
                      const newProject = { title: "Nouveau Projet", description: "Description...", tags: ["React"], image: "" };
                      updateData("projects", [...data.projects, newProject]);
                    }}
                    className="p-2 glass rounded-lg text-purple-400 hover:bg-white/5"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {data.projects.map((proj: any, index: number) => (
                    <div key={index} className="glass p-4 rounded-xl space-y-2 border border-white/5">
                      <input 
                        type="text" 
                        value={proj.title} 
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[index].title = e.target.value;
                          updateData("projects", updated);
                        }}
                        placeholder="Titre"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <textarea 
                        value={proj.description} 
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[index].description = e.target.value;
                          updateData("projects", updated);
                        }}
                        placeholder="Description"
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <input 
                        type="text" 
                        value={proj.image} 
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[index].image = e.target.value;
                          updateData("projects", updated);
                        }}
                        placeholder="Image URL"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => updateData("projects", data.projects.filter((_: any, i: number) => i !== index))}
                          className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Management */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest">Services</h3>
                  <button 
                    onClick={() => {
                      const newService = { title: "Nouveau Service", description: "Description...", icon: "Layout" };
                      updateData("services", [...data.services, newService]);
                    }}
                    className="p-2 glass rounded-lg text-purple-400 hover:bg-white/5"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {data.services.map((service: any, index: number) => (
                    <div key={index} className="glass p-4 rounded-xl space-y-2 border border-white/5">
                      <input 
                        type="text" 
                        value={service.title} 
                        onChange={(e) => {
                          const updated = [...data.services];
                          updated[index].title = e.target.value;
                          updateData("services", updated);
                        }}
                        placeholder="Titre"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <textarea 
                        value={service.description} 
                        onChange={(e) => {
                          const updated = [...data.services];
                          updated[index].description = e.target.value;
                          updateData("services", updated);
                        }}
                        placeholder="Description"
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <select
                        value={service.icon}
                        onChange={(e) => {
                          const updated = [...data.services];
                          updated[index].icon = e.target.value;
                          updateData("services", updated);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs focus:outline-none"
                      >
                        <option value="Layout">Layout</option>
                        <option value="Smartphone">Smartphone</option>
                        <option value="Server">Server</option>
                        <option value="Coffee">Coffee</option>
                      </select>
                      <button 
                        onClick={() => updateData("services", data.services.filter((_: any, i: number) => i !== index))}
                        className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery removed: site uses Publications as feed */}

              {/* Publications Management */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest">Publications</h3>
                  <button 
                    onClick={() => {
                      const newPost = { 
                        id: Date.now().toString(),
                        title: "Nouveau Post", 
                        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), 
                        excerpt: "Résumé...",
                        content: "Contenu...",
                        image: "" 
                      };
                      updateData("publications", [...(data.publications || []), newPost]);
                    }}
                    className="p-2 glass rounded-lg text-purple-400 hover:bg-white/5"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {data.publications?.map((post: any, index: number) => (
                    <div key={post.id || index} className="glass p-4 rounded-xl space-y-3 border border-white/5">
                      <input 
                        type="text" 
                        value={post.title} 
                        onChange={(e) => {
                          const updated = [...data.publications];
                          updated[index].title = e.target.value;
                          updateData("publications", updated);
                        }}
                        placeholder="Titre"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <input 
                        type="text" 
                        value={post.date} 
                        onChange={(e) => {
                          const updated = [...data.publications];
                          updated[index].date = e.target.value;
                          updateData("publications", updated);
                        }}
                        placeholder="Date (ex: 12 Mai 2024)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <textarea 
                        value={post.excerpt} 
                        onChange={(e) => {
                          const updated = [...data.publications];
                          updated[index].excerpt = e.target.value;
                          updateData("publications", updated);
                        }}
                        placeholder="Résumé"
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <textarea 
                        value={post.content} 
                        onChange={(e) => {
                          const updated = [...data.publications];
                          updated[index].content = e.target.value;
                          updateData("publications", updated);
                        }}
                        placeholder="Contenu complet"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <input 
                        type="text" 
                        value={post.image} 
                        onChange={(e) => {
                          const updated = [...data.publications];
                          updated[index].image = e.target.value;
                          updateData("publications", updated);
                        }}
                        placeholder="Image URL"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                      />
                      <button 
                        onClick={() => updateData("publications", data.publications.filter((_: any, i: number) => i !== index))}
                        className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10">
                <button 
                  onClick={() => {
                    if (confirm("Réinitialiser toutes les données ?")) {
                      updateData("RESET", INITIAL_DATA);
                    }
                  }}
                  className="w-full border border-red-500/30 text-red-500 py-3 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-colors"
                >
                  Réinitialiser le Portfolio
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
