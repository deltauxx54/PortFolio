import React, { useState, useRef, useCallback } from "react";
import { Settings, Terminal, Plus, Trash2, Download, Upload, Github, Linkedin, Twitter, Mail } from "lucide-react";

interface AdminProps {
  data: any;
  updateData: (key: string, value: any) => void;
  updateColor: (key: string, value: string) => void;
  handleLogout: () => void;
  INITIAL_DATA: any;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB (to allow small 6s videos/gifs)

export const Admin: React.FC<AdminProps> = ({ data, updateData, updateColor, handleLogout, INITIAL_DATA }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [profilePreview, setProfilePreview] = useState<string>(data.photoUrl || "");
  const [activeTab, setActiveTab] = useState<string>("informations");
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#030303]/95 backdrop-blur-md z-[200] fixed inset-0">
        <div className="glass p-10 rounded-[2.5rem] border border-white/10 max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] bg-purple-500/20 -z-10" />
          <div className="text-purple-400 mb-6 flex justify-center">
            <Settings className="w-16 h-16 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4 tracking-tighter">🔒 Accès Restreint</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            L'administration du portfolio est uniquement disponible sur **ordinateur (Desktop)** pour des raisons de confort et de sécurité de vos modifications.
          </p>
          <button onClick={handleLogout} className="inline-block bg-gradient-custom px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/20">
            Retour au site
          </button>
        </div>
      </div>
    );
  }

  const handleProfileFile = useCallback(async (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) { setUploadError("Fichier trop volumineux (max 5MB)"); return; }
    const url = await fileToDataUrl(file);
    setProfilePreview(url);
    updateData("photoUrl", url);
    setUploadError(null);
  }, [updateData]);

  const handleProjectFile = useCallback(async (index: number, file: File) => {
    if (file.size > MAX_IMAGE_SIZE) { setUploadError("Fichier trop volumineux (max 3MB)"); return; }
    const url = await fileToDataUrl(file);
    const updated = [...(data.projects || [])];
    updated[index] = { ...updated[index], image: url };
    updateData("projects", updated);
    setUploadError(null);
  }, [data.projects, updateData]);

  const handlePublicationFile = useCallback(async (index: number, file: File) => {
    if (file.size > MAX_IMAGE_SIZE) { setUploadError("Fichier trop volumineux (max 3MB)"); return; }
    const url = await fileToDataUrl(file);
    const updated = [...(data.publications || [])];
    updated[index] = { ...updated[index], image: url };
    updateData("publications", updated);
    setUploadError(null);
  }, [data.publications, updateData]);

  const onProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; await handleProfileFile(file); e.currentTarget.value = ""; };

  const onProjectImageChange = (index: number) => async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; await handleProjectFile(index, file); e.currentTarget.value = ""; };

  const onPublicationImageChange = (index: number) => async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; await handlePublicationFile(index, file); e.currentTarget.value = ""; };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "portfolio_data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      Object.keys(parsed).forEach((k) => updateData(k, parsed[k]));
      alert("Import terminé");
    } catch (err) { alert("JSON invalide"); }
    e.currentTarget.value = "";
  };

  return (
    <div className="pt-28 md:pt-40 px-4 md:px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Settings className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-display font-bold">Tableau de Bord</h1>
              <p className="text-sm text-gray-400">Gestion centralisée du portefeuille</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase font-bold">Statut</div>
              <div className="font-bold">Administrateur</div>
            </div>
            <button onClick={handleLogout} className="glass p-3 rounded-2xl hover:bg-red-500/20 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-red-400">
              <Terminal className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            { id: "informations", label: "Informations" },
            { id: "projets", label: "Projets" },
            { id: "publications", label: "Publications" },
            { id: "technologies", label: "Technologies" },
            { id: "reseaux", label: "Réseaux" },
            { id: "apparence", label: "Apparence" },
            { id: "services", label: "Services" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-3 py-2 rounded-lg text-sm ${activeTab === t.id ? "bg-white/5 font-bold" : "bg-transparent"}`}>
              {t.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button onClick={exportJson} className="glass p-2 rounded-lg flex items-center gap-2"><Download className="w-4 h-4"/>Exporter</button>
            <label className="glass p-2 rounded-lg flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4"/>Importer<input type="file" accept="application/json" onChange={importJson} className="hidden"/></label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {activeTab === "informations" && (
              <section className="glass p-6 rounded-2xl border border-white/10 mb-6">
                <h2 className="font-bold mb-4">Informations Générales</h2>
                <div className="md:flex md:items-start gap-6">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-black flex items-center justify-center">
                    <img src={profilePreview || data.photoUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400">Photo / Vidéo (URL ou Fichier)</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" value={data.photoUrl} onChange={(e) => { updateData("photoUrl", e.target.value); setProfilePreview(e.target.value); }} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none" placeholder="https://..." />
                      <label className="inline-block bg-white/5 px-3 py-2 rounded-xl cursor-pointer text-sm">
                        Importer
                        <input type="file" accept="image/*,video/mp4,video/webm" onChange={onProfileChange} className="hidden" />
                      </label>
                    </div>
                    {uploadError && <div className="text-xs text-red-400 mt-2">{uploadError}</div>}

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-xs text-gray-400">Prénom</label>
                        <input type="text" value={data.name} onChange={(e) => updateData("name", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Nom de famille</label>
                        <input type="text" value={data.lastName} onChange={(e) => updateData("lastName", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Titre</label>
                        <input type="text" value={data.title} onChange={(e) => updateData("title", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Description</label>
                        <textarea value={data.description} onChange={(e) => updateData("description", e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Adresse e-mail de contact</label>
                        <input type="email" value={data.email} onChange={(e) => updateData("email", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">CV (Fichier PDF ou URL)</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={data.cvUrl || ""}
                            onChange={(e) => updateData("cvUrl", e.target.value)}
                            placeholder="URL du CV"
                            className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                          />
                          <label className="inline-block bg-white/5 px-3 py-2 rounded-xl cursor-pointer text-sm">
                            Importer PDF
                            <input type="file" accept="application/pdf" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) { alert("Le PDF ne doit pas dépasser 5Mo"); return; }
                              const url = await fileToDataUrl(file);
                              updateData("cvUrl", url);
                            }} className="hidden" />
                          </label>
                        </div>
                        {data.cvUrl && (
                          <a href={data.cvUrl} target="_blank" rel="noreferrer"
                            className="text-xs text-purple-400 hover:underline mt-1 inline-block">
                            Aperçu du CV →
                          </a>
                        )}
                      </div>

                      {/* Fiches À Propos Stats */}
                      <div className="mt-6 border-t border-white/5 pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-bold text-white">Fiches de la Section "À Propos"</h3>
                          <button
                            onClick={() => {
                              const updated = [...(data.aboutStats || [
                                { label: "Expérience", value: "Dév Junior", sub: "32 ans de passion & curiosité", icon: "Briefcase" },
                                { label: "Éducation", value: "Étudiant Actif", sub: "Apprentissage continu", icon: "GraduationCap" },
                                { label: "Gestion", value: "Expert Jira", sub: "Méthodologies Agiles", icon: "CheckCircle2" }
                              ])];
                              updated.push({ label: "Nouveau Label", value: "Nouvelle Valeur", sub: "Nouveau sous-titre", icon: "Briefcase" });
                              updateData("aboutStats", updated);
                            }}
                            className="px-3 py-1.5 glass rounded-lg text-xs font-bold text-purple-400 hover:bg-white/5 flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Ajouter une fiche
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {(data.aboutStats || [
                            { label: "Expérience", value: "Dév Junior", sub: "32 ans de passion & curiosité", icon: "Briefcase" },
                            { label: "Éducation", value: "Étudiant Actif", sub: "Apprentissage continu", icon: "GraduationCap" },
                            { label: "Gestion", value: "Expert Jira", sub: "Méthodologies Agiles", icon: "CheckCircle2" }
                          ]).map((stat: any, index: number) => (
                            <div key={index} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3 relative">
                              <div className="flex justify-between items-center">
                                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                                  Fiche {index + 1} ({stat.label || "Sans étiquette"})
                                </div>
                                <button
                                  onClick={() => {
                                    const updated = [...(data.aboutStats || [
                                      { label: "Expérience", value: "Dév Junior", sub: "32 ans de passion & curiosité", icon: "Briefcase" },
                                      { label: "Éducation", value: "Étudiant Actif", sub: "Apprentissage continu", icon: "GraduationCap" },
                                      { label: "Gestion", value: "Expert Jira", sub: "Méthodologies Agiles", icon: "CheckCircle2" }
                                    ])];
                                    updated.splice(index, 1);
                                    updateData("aboutStats", updated);
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Supprimer la fiche"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="text-[10px] text-gray-400">Étiquette (Label)</label>
                                  <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => {
                                      const updated = [...(data.aboutStats || [])];
                                      updated[index] = { ...updated[index], label: e.target.value };
                                      updateData("aboutStats", updated);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-400">Valeur (Value)</label>
                                  <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => {
                                      const updated = [...(data.aboutStats || [])];
                                      updated[index] = { ...updated[index], value: e.target.value };
                                      updateData("aboutStats", updated);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-400">Sous-titre (Subtitle)</label>
                                  <input
                                    type="text"
                                    value={stat.sub}
                                    onChange={(e) => {
                                      const updated = [...(data.aboutStats || [])];
                                      updated[index] = { ...updated[index], sub: e.target.value };
                                      updateData("aboutStats", updated);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-400">Logo (Icône Lucide)</label>
                                  <select
                                    value={stat.icon || "Briefcase"}
                                    onChange={(e) => {
                                      const updated = [...(data.aboutStats || [])];
                                      updated[index] = { ...updated[index], icon: e.target.value };
                                      updateData("aboutStats", updated);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white mb-1"
                                  >
                                    <option value="Briefcase">💼 Expérience (Briefcase)</option>
                                    <option value="GraduationCap">🎓 Éducation (GraduationCap)</option>
                                    <option value="CheckCircle2">✅ Validation (CheckCircle2)</option>
                                    <option value="Award">🏆 Trophée (Award)</option>
                                    <option value="Heart">❤️ Passion (Heart)</option>
                                    <option value="Globe">🌐 Globe (Globe)</option>
                                    <option value="Cpu">💻 Technologie (Cpu)</option>
                                    <option value="Zap">⚡ Vitesse (Zap)</option>
                                    <option value="BookOpen">📖 Livre (BookOpen)</option>
                                    <option value="Terminal">💻 Terminal (Terminal)</option>
                                    <option value="Star">⭐ Étoile (Star)</option>
                                    <option value="Smile">😊 Relationnel (Smile)</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={stat.icon || ""}
                                    placeholder="Autre nom Lucide..."
                                    onChange={(e) => {
                                      const updated = [...(data.aboutStats || [])];
                                      updated[index] = { ...updated[index], icon: e.target.value };
                                      updateData("aboutStats", updated);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-gray-300"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "projets" && (
              <section className="glass p-6 rounded-2xl border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold">Projets</h2>
                  <button onClick={() => updateData("projects", [...(data.projects || []), { title: "Nouveau Projet", description: "Description du projet", tags: [], image: "", category: "Web", githubUrl: "", liveUrl: "" }])} className="p-2 glass rounded-lg text-purple-400 hover:bg-white/5">Ajouter</button>
                </div>
                <div className="space-y-4">
                  {(data.projects || []).map((proj: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-white/5 flex gap-4 items-start">
                      <div className="w-24 h-24 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                        {proj.image ? (
                          <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="text-xs text-gray-500">Aucune image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input type="text" value={proj.title} onChange={(e) => { const updated = [...(data.projects || [])]; updated[index].title = e.target.value; updateData("projects", updated); }} placeholder="Titre" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2" />
                        <select value={proj.category || "Web"} onChange={(e) => { const updated = [...(data.projects || [])]; updated[index].category = e.target.value; updateData("projects", updated); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2 text-white">
                          <option value="Web" className="bg-black">Web</option>
                          <option value="Application" className="bg-black">Application</option>
                          <option value="Maquette Figma" className="bg-black">Maquette Figma</option>
                        </select>
                        <textarea value={proj.description} onChange={(e) => { const updated = [...(data.projects || [])]; updated[index].description = e.target.value; updateData("projects", updated); }} placeholder="Description" rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2" />
                        <div className="flex gap-2 mb-2">
                          <input type="text" value={proj.githubUrl || ""} onChange={(e) => { const updated = [...(data.projects || [])]; updated[index].githubUrl = e.target.value; updateData("projects", updated); }} placeholder="Lien GitHub" className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
                          <input type="text" value={proj.liveUrl || ""} onChange={(e) => { const updated = [...(data.projects || [])]; updated[index].liveUrl = e.target.value; updateData("projects", updated); }} placeholder="Lien Live" className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="bg-white/5 px-3 py-2 rounded-lg cursor-pointer text-sm">Importer image<input type="file" accept="image/*" onChange={onProjectImageChange(index)} className="hidden" /></label>
                          <input type="text" value={proj.image} onChange={(e) => { const updated = [...(data.projects || [])]; updated[index].image = e.target.value; updateData("projects", updated); }} placeholder="Image URL" className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
                          <button onClick={() => updateData("projects", (data.projects || []).filter((_: any, i: number) => i !== index))} className="text-red-500 p-2">Supprimer</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "publications" && (
              <section className="glass p-6 rounded-2xl border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold">Publications</h2>
                  <button onClick={() => {
                    const newPost = { id: Date.now().toString(), title: "Nouveau Post", date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), excerpt: "Résumé...", content: "Contenu...", image: "", videoUrl: "" };
                    updateData("publications", [...(data.publications || []), newPost]);
                  }} className="p-2 glass rounded-lg text-purple-400 hover:bg-white/5">Ajouter</button>
                </div>
                <div className="space-y-4">
                  {(data.publications || []).map((post: any, index: number) => (
                    <div key={post.id || index} className="p-4 rounded-xl border border-white/5">
                      <div className="flex gap-4">
                        <div className="w-28 h-28 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                          {post.image ? <img src={post.image} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <div className="text-xs text-gray-500">Aucune image</div>}
                        </div>
                        <div className="flex-1">
                          <input type="text" value={post.title} onChange={(e) => { const updated = [...(data.publications || [])]; updated[index].title = e.target.value; updateData("publications", updated); }} placeholder="Titre" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2" />
                          <input type="text" value={post.date} onChange={(e) => { const updated = [...(data.publications || [])]; updated[index].date = e.target.value; updateData("publications", updated); }} placeholder="Date" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2" />
                          <textarea value={post.excerpt} onChange={(e) => { const updated = [...(data.publications || [])]; updated[index].excerpt = e.target.value; updateData("publications", updated); }} placeholder="Résumé" rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2" />
                          <textarea value={post.content} onChange={(e) => { const updated = [...(data.publications || [])]; updated[index].content = e.target.value; updateData("publications", updated); }} placeholder="Contenu" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2" />
                          <input type="text" value={post.videoUrl || ""} onChange={(e) => { const updated = [...(data.publications || [])]; updated[index].videoUrl = e.target.value; updateData("publications", updated); }} placeholder="URL Vidéo (Optionnel, ex: mp4)" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mb-2" />
                          <div className="flex items-center gap-2">
                            <label className="bg-white/5 px-3 py-2 rounded-lg cursor-pointer text-sm">Importer image<input type="file" accept="image/*" onChange={onPublicationImageChange(index)} className="hidden" /></label>
                            <input type="text" value={post.image} onChange={(e) => { const updated = [...(data.publications || [])]; updated[index].image = e.target.value; updateData("publications", updated); }} placeholder="Image URL" className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
                            <button onClick={() => updateData("publications", (data.publications || []).filter((_: any, i: number) => i !== index))} className="text-red-500 p-2">Supprimer</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "technologies" && (
              <section className="glass p-6 rounded-2xl border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold">Technologies</h2>
                  <button onClick={() => updateData("technologies", [...(data.technologies || []), { name: "Nouvelle Techno", slug: "react", color: "#FFFFFF", description: "Description...", level: 80 }])} className="p-2 glass rounded-lg text-purple-400 hover:bg-white/5">Ajouter</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(data.technologies || []).map((tech: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-white/5 flex flex-col gap-2 relative">
                      <button onClick={() => updateData("technologies", (data.technologies || []).filter((_: any, i: number) => i !== index))} className="absolute top-4 right-4 text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      <div className="flex items-center gap-3 mb-2">
                        <img src={`https://cdn.simpleicons.org/${tech.slug.toLowerCase()}/white`} alt={tech.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><circle cx='12' cy='12' r='10'/></svg>"; }} />
                        <span className="font-bold text-sm" style={{ color: tech.color }}>{tech.name}</span>
                      </div>
                      <input type="text" value={tech.name} onChange={(e) => { const updated = [...(data.technologies || [])]; updated[index].name = e.target.value; updateData("technologies", updated); }} placeholder="Nom" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
                      <div className="flex gap-2">
                        <input type="text" value={tech.slug} onChange={(e) => { const updated = [...(data.technologies || [])]; updated[index].slug = e.target.value.toLowerCase().replace(/\\s+/g, ''); updateData("technologies", updated); }} placeholder="Slug (ex: react)" className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
                        <input type="color" value={tech.color || "#ffffff"} onChange={(e) => { const updated = [...(data.technologies || [])]; updated[index].color = e.target.value; updateData("technologies", updated); }} className="w-1/2 h-10 rounded-lg cursor-pointer" title="Couleur de la marque" />
                      </div>
                      <div>
                        <textarea
                          value={tech.description || ""}
                          onChange={(e) => {
                            const updated = [...(data.technologies || [])];
                            updated[index].description = e.target.value;
                            updateData("technologies", updated);
                          }}
                          placeholder="Description de la compétence..."
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder:text-gray-600 resize-none mt-1"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="text-[10px] text-gray-400 whitespace-nowrap">Niveau (%) :</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={tech.level || 80}
                          onChange={(e) => {
                            const updated = [...(data.technologies || [])];
                            updated[index].level = parseInt(e.target.value) || 0;
                            updateData("technologies", updated);
                          }}
                          className="flex-1 accent-purple-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-purple-400 w-8 text-right">{tech.level || 80}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {activeTab === "reseaux" && (
              <section className="glass p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Réseaux Sociaux</h3>
                  <button onClick={() => updateData("socials", [...(Array.isArray(data.socials) ? data.socials : []), { platform: "Nouveau", url: "", slug: "github" }])} className="p-1.5 glass rounded-lg text-purple-400 hover:bg-white/5"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                  {(Array.isArray(data.socials) ? data.socials : []).map((social: any, i: number) => {
                    const renderSocialIcon = (platform: string, slug: string) => {
                      const normalized = platform.toLowerCase().trim();
                      const className = "w-4 h-4 text-purple-400";
                      if (normalized === "linkedin") return <Linkedin className={className} />;
                      if (normalized === "github") return <Github className={className} />;
                      if (normalized === "twitter" || normalized === "x") return <Twitter className={className} />;
                      if (normalized === "email" || normalized === "mail") return <Mail className={className} />;
                      return (
                        <img 
                          src={`https://cdn.simpleicons.org/${slug.toLowerCase()}/white`} 
                          alt={platform} 
                          className="w-4 h-4 object-contain" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                        />
                      );
                    };

                    return (
                      <div key={i} className="p-3 rounded-lg border border-white/5 relative">
                        <button onClick={() => updateData("socials", data.socials.filter((_: any, idx: number) => idx !== i))} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                        <div className="flex items-center gap-2 mb-2">
                          {renderSocialIcon(social.platform, social.slug)}
                          <span className="font-bold text-xs">{social.platform}</span>
                        </div>
                        <input type="text" value={social.platform} onChange={(e) => { const updated = [...data.socials]; updated[i].platform = e.target.value; updateData("socials", updated); }} placeholder="Nom" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs mb-2" />
                        <input type="text" value={social.slug} onChange={(e) => { const updated = [...data.socials]; updated[i].slug = e.target.value.toLowerCase(); updateData("socials", updated); }} placeholder="Slug (ex: linkedin)" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs mb-2" />
                        <input type="text" value={social.url} onChange={(e) => { const updated = [...data.socials]; updated[i].url = e.target.value; updateData("socials", updated); }} placeholder="URL (https://...)" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs" />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === "apparence" && (
              <section className="glass p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold mb-3">Thème & Couleurs</h3>
                <div className="grid grid-cols-1 gap-3">
                  {(["primary", "secondary", "accent", "bg"] as const).map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <input type="color" value={data.colors[key]} onChange={(e) => updateColor(key, e.target.value)} className="w-10 h-10 rounded-lg" />
                      <input type="text" value={data.colors[key]} readOnly className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-sm" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "services" && (
              <section className="glass p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold mb-3">Services</h3>
                <div className="space-y-3">
                  {data.services.map((s: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg border border-white/5 flex items-start justify-between">
                      <div>
                        <div className="font-bold">{s.title}</div>
                        <div className="text-xs text-gray-400">{s.description}</div>
                      </div>
                      <button onClick={() => updateData("services", data.services.filter((_: any, idx: number) => idx !== i))} className="text-red-500">Supprimer</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div>
              <button onClick={() => { if (confirm("Réinitialiser toutes les données ?")) updateData("RESET", INITIAL_DATA); }} className="w-full border border-red-500/30 text-red-500 py-3 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-colors">Réinitialiser le Portfolio</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
