"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, CheckCircle2, Eye, EyeOff, ImagePlus, LayoutGrid, LoaderCircle, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { publishServices, uploadServiceImage } from "@/app/admin/actions";
import type { ManagedService, ServiceContent } from "@/lib/admin/types";

const GROUP_LABELS = { love: "Love & Marriage", life: "Family, Career & Life" };

export default function ServiceManager({ initialContent }: { initialContent: ServiceContent }) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(JSON.stringify(initialContent));
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [editing, setEditing] = useState<ManagedService | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const dirty = JSON.stringify(content) !== saved;
  const visible = content.services.filter(s => s.visible).length;
  const filtered = content.services.filter(s => (group === "all" || s.group === group) && s.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function warn(event: BeforeUnloadEvent) { if (dirty) event.preventDefault(); }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function updateServices(services: ManagedService[]) { setContent(c => ({ ...c, services })); setMessage({}); }
  function move(id: string, direction: -1 | 1) {
    const services = [...content.services];
    const index = services.findIndex(s => s.id === id);
    // Ordering is within the selected service's public group.
    let target = index + direction;
    while (target >= 0 && target < services.length && services[target].group !== services[index].group) target += direction;
    if (target < 0 || target >= services.length) return;
    [services[index], services[target]] = [services[target], services[index]];
    updateServices(services);
  }
  async function publish() {
    setPending(true); setMessage({});
    try {
      const result = await publishServices(content);
      if (result.content) {
        setContent(result.content); setSaved(JSON.stringify(result.content));
        setMessage({ success: "Changes published. Your website is up to date." });
      } else setMessage({ error: result.error || "Could not publish changes." });
    } catch { setMessage({ error: "Connection lost. Your changes are still here; please try again." }); }
    finally { setPending(false); }
  }
  return <div className="admin-content">
    <div className="admin-page-heading"><div><span className="admin-eyebrow">CONTENT MANAGEMENT</span><h1>Your services</h1><p>Make every service feel clear, helpful, and up to date.</p></div>
      <button className="admin-button primary" disabled={!dirty || pending} onClick={publish}>{pending ? <LoaderCircle className="admin-spin" size={18} /> : <Save size={18} />}{pending ? "Publishing…" : "Publish changes"}</button>
    </div>
    <div className="admin-stats">
      <div className="admin-stat"><span className="admin-stat-icon"><LayoutGrid size={21} /></span><div><span>Total services</span><strong>{content.services.length}</strong></div></div>
      <div className="admin-stat"><span className="admin-stat-icon green"><Eye size={21} /></span><div><span>Visible on website</span><strong>{visible}</strong></div></div>
      <div className="admin-stat"><span className="admin-stat-icon amber"><EyeOff size={21} /></span><div><span>Hidden services</span><strong>{content.services.length - visible}</strong></div></div>
    </div>
    <div className={`admin-save-status ${dirty ? "unsaved" : ""}`} role="status"><span>{dirty ? <><span className="admin-status-dot" /> You have unpublished changes</> : <><CheckCircle2 size={16} /> All changes saved</>}</span><small>{content.updatedAt ? `Last published ${new Date(content.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST` : "Ready to edit"}</small></div>
    {message.error && <div className="admin-notice error" role="alert">{message.error}</div>}
    {message.success && <div className="admin-notice success" role="status">{message.success}</div>}
    <section className="admin-panel" aria-label="Manage services">
      <div className="admin-panel-heading"><div><h2>Service library <span>{content.services.length}</span></h2><p>Edit a card, change its image, or choose what appears on your website.</p></div><button className="admin-button secondary" disabled={pending || content.services.length >= 60} onClick={() => setEditing({ id: crypto.randomUUID(), title: "", text: "", img: "/assets/img/service/love-problem-realistic.webp", group: "love", visible: true })}><Plus size={18} /> Add service</button></div>
      <div className="admin-filters"><div className="admin-search"><Search size={18} /><input aria-label="Search services" placeholder="Search services…" value={query} onChange={e => setQuery(e.target.value)} /></div><select aria-label="Filter by service group" value={group} onChange={e => setGroup(e.target.value)}><option value="all">All categories</option><option value="love">Love & Marriage</option><option value="life">Family, Career & Life</option></select></div>
      <div className="admin-list-labels"><span>SERVICE</span><span>STATUS & ACTIONS</span></div>
      <div className="admin-service-list">
        {filtered.map(service => {
          const siblings = content.services.filter(s => s.group === service.group);
          return <article className="admin-service-row" key={service.id}>
            <img src={service.img} alt="" width={112} height={84} loading="lazy" referrerPolicy="no-referrer" />
            <div className="admin-service-info"><span className="admin-category">{GROUP_LABELS[service.group]}</span><h3>{service.title}</h3><p>{service.text}</p></div>
            <div className="admin-row-actions"><button disabled={pending} className={`admin-visibility ${service.visible ? "visible" : ""}`} onClick={() => updateServices(content.services.map(s => s.id === service.id ? { ...s, visible: !s.visible } : s))} aria-label={`${service.visible ? "Hide" : "Show"} ${service.title}`} aria-pressed={service.visible}>{service.visible ? <Eye size={14} /> : <EyeOff size={14} />}{service.visible ? "Visible" : "Hidden"}</button>
              <div className="admin-order"><button className="admin-icon-button" disabled={pending || siblings[0].id === service.id} onClick={() => move(service.id, -1)} aria-label={`Move ${service.title} up`}><ArrowUp size={16} /></button><button className="admin-icon-button" disabled={pending || siblings[siblings.length - 1].id === service.id} onClick={() => move(service.id, 1)} aria-label={`Move ${service.title} down`}><ArrowDown size={16} /></button></div>
              <button className="admin-edit-button" disabled={pending} onClick={() => setEditing({ ...service })}><Pencil size={15} /> Edit</button>
            </div>
          </article>;
        })}
        {!filtered.length && <div className="admin-empty"><Search size={30} /><h3>No services found</h3><p>Try another search or add your first service.</p></div>}
      </div>
      <div className="admin-panel-footer">Showing {filtered.length} of {content.services.length} services <span>Changes go live when you publish.</span></div>
    </section>
    <p className="admin-bottom-note"><CheckCircle2 size={15} /> Your content is stored securely in Supabase.</p>
    {editing && <ServiceEditor service={editing} existing={content.services.some(s => s.id === editing.id)} onClose={() => setEditing(null)} onApply={service => {
      updateServices(content.services.some(s => s.id === service.id) ? content.services.map(s => s.id === service.id ? service : s) : [...content.services, service]);
      setEditing(null);
    }} onDelete={() => { updateServices(content.services.filter(s => s.id !== editing.id)); setEditing(null); }} />}
  </div>;
}

function ServiceEditor({ service, existing, onClose, onApply, onDelete }: { service: ManagedService; existing: boolean; onClose: () => void; onApply: (s: ManagedService) => void; onDelete: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(service);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => { const node = dialog.current; node?.showModal(); return () => node?.close(); }, []);
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Please choose an image smaller than 5 MB."); return; }
    setUploading(true); setError("");
    try {
      const form = new FormData(); form.set("image", file);
      const result = await uploadServiceImage(form);
      if (result.path) setDraft(d => ({ ...d, img: result.path! }));
      else setError(result.error || "Upload failed.");
    } catch { setError("The upload was interrupted. Please try again."); }
    finally { setUploading(false); }
  }
  return <dialog className="admin-dialog" ref={dialog} aria-labelledby="service-editor-title" onCancel={event => { if (uploading) event.preventDefault(); else onClose(); }}>
    <div className="admin-dialog-heading"><div><span className="admin-eyebrow">SERVICE DETAILS</span><h2 id="service-editor-title">{existing ? "Edit service" : "Add a service"}</h2></div><button className="admin-icon-button" disabled={uploading} onClick={onClose} aria-label="Close editor"><X size={22} /></button></div>
    <form className="admin-form" onSubmit={event => { event.preventDefault(); onApply({ ...draft, title: draft.title.trim(), text: draft.text.trim() }); }}>
      <div className="admin-editor-image"><img src={draft.img} alt="Service image preview" width={600} height={450} referrerPolicy="no-referrer" /><button className="admin-button secondary" type="button" disabled={uploading} onClick={() => fileInput.current?.click()}>{uploading ? <LoaderCircle size={17} className="admin-spin" /> : <ImagePlus size={17} />}{uploading ? "Uploading…" : "Upload image"}</button></div>
      <input className="admin-hidden" ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" aria-label="Upload service image" onChange={e => void upload(e.target.files?.[0])} />
      <small>JPG, PNG, or WebP · Up to 5 MB · Automatically optimized to 4:3</small>
      <label htmlFor="service-title">Service title</label><input id="service-title" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} required maxLength={100} />
      <label htmlFor="service-description">Description</label><textarea id="service-description" rows={4} value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} required maxLength={2000} />
      <label htmlFor="service-group">Category</label><select id="service-group" value={draft.group} onChange={e => setDraft({ ...draft, group: e.target.value as "love" | "life" })}><option value="love">Love & Marriage</option><option value="life">Family, Career & Life</option></select>
      <label htmlFor="service-image">Image URL or local path</label><input id="service-image" value={draft.img} onChange={e => setDraft({ ...draft, img: e.target.value })} maxLength={2048} required />
      <label className="admin-checkbox"><input type="checkbox" checked={draft.visible} onChange={e => setDraft({ ...draft, visible: e.target.checked })} />Show this service on the website</label>
      {error && <p role="alert" className="admin-field-error">{error}</p>}
      <div className="admin-dialog-footer"><div>{existing && (confirmDelete ? <button type="button" className="admin-delete" disabled={uploading} onClick={onDelete}>Confirm removal</button> : <button type="button" className="admin-delete" disabled={uploading} onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Remove</button>)}</div><button type="button" className="admin-button secondary" onClick={onClose} disabled={uploading}>Cancel</button><button className="admin-button primary" disabled={uploading}><Check size={17} /> Apply changes</button></div>
      <small>Apply adds this edit to your draft. Publish from the dashboard to update the website.</small>
    </form>
  </dialog>;
}
