"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  LayoutGrid,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { publishServices, uploadServiceImage } from "@/app/admin/actions";
import { slugify, type ManagedService, type ServiceContent } from "@/lib/admin/types";
import { cleanPlainField, cleanRichHtmlArtifacts } from "@/lib/htmlSanitize";
import FormatToolbar from "./FormatToolbar";
import LiveContentPreview from "./LiveContentPreview";
import RichWysiwygEditor from "./RichWysiwygEditor";

const GROUP_LABELS = { love: "Love & Marriage", life: "Family, Career & Life" };

export default function ServiceManager({ initialContent }: { initialContent: ServiceContent }) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(JSON.stringify(initialContent));
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'main' | 'location' | 'love' | 'life'
  const [editing, setEditing] = useState<ManagedService | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const dirty = JSON.stringify(content) !== saved;
  const visible = content.services.filter((s) => s.visible).length;

  const mainServices = content.services.filter((s) => !s.parentId);
  const locationServices = content.services.filter((s) => !!s.parentId);

  const filtered = content.services.filter((s) => {
    const matchesQuery =
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      (s.location && s.location.toLowerCase().includes(query.toLowerCase())) ||
      s.slug.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (filterType === "main") return !s.parentId;
    if (filterType === "location") return !!s.parentId;
    if (filterType === "love") return s.group === "love";
    if (filterType === "life") return s.group === "life";
    return true;
  });

  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (dirty) event.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function updateServices(services: ManagedService[]) {
    setContent((c) => ({ ...c, services }));
    setMessage({});
  }

  function move(id: string, direction: -1 | 1) {
    const services = [...content.services];
    const index = services.findIndex((s) => s.id === id);
    let target = index + direction;
    while (
      target >= 0 &&
      target < services.length &&
      services[target].group !== services[index].group
    ) {
      target += direction;
    }
    if (target < 0 || target >= services.length) return;
    [services[index], services[target]] = [services[target], services[index]];
    updateServices(services);
  }

  async function publish() {
    setPending(true);
    setMessage({});
    try {
      const result = await publishServices(content);
      if (result.content) {
        setContent(result.content);
        setSaved(JSON.stringify(result.content));
        setMessage({ success: "Changes published. Your website is up to date." });
      } else setMessage({ error: result.error || "Could not publish changes." });
    } catch {
      setMessage({ error: "Connection lost. Your changes are still here; please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Your services &amp; location pages</h1>
          <p>Manage main Vedic astrology services and city/country landing pages (Delhi, Canada, Mumbai, etc.).</p>
        </div>
        <button
          className="admin-button primary"
          disabled={!dirty || pending}
          onClick={publish}
        >
          {pending ? <LoaderCircle className="admin-spin" size={18} /> : <Save size={18} />}
          {pending ? "Publishing…" : "Publish changes"}
        </button>
      </div>

      {dirty && (
        <div
          style={{
            background: "rgba(227, 182, 92, 0.15)",
            border: "1.5px solid var(--gold)",
            borderRadius: "10px",
            padding: "12px 18px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "var(--gold-light)", fontWeight: 600 }}>
            ⚠️ You have unpublished changes! Click &quot;Publish changes&quot; to make your new pages live.
          </span>
          <button
            className="admin-button primary"
            disabled={pending}
            onClick={publish}
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            {pending ? "Publishing…" : "Publish changes now"}
          </button>
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-icon">
            <LayoutGrid size={21} />
          </span>
          <div>
            <span>Main services</span>
            <strong>{mainServices.length}</strong>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon" style={{ background: "rgba(227, 182, 92, 0.2)", color: "var(--gold)" }}>
            <MapPin size={21} />
          </span>
          <div>
            <span>Location pages</span>
            <strong>{locationServices.length}</strong>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon green">
            <Eye size={21} />
          </span>
          <div>
            <span>Visible online</span>
            <strong>{visible}</strong>
          </div>
        </div>
      </div>

      <div className={`admin-save-status ${dirty ? "unsaved" : ""}`} role="status">
        <span>
          {dirty ? (
            <>
              <span className="admin-status-dot" /> You have unpublished changes
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> All changes saved
            </>
          )}
        </span>
        <small>
          {content.updatedAt
            ? `Last published ${new Date(content.updatedAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short",
              })} IST`
            : "Ready to edit"}
        </small>
      </div>

      {message.error && (
        <div className="admin-notice error" role="alert">
          {message.error}
        </div>
      )}
      {message.success && (
        <div className="admin-notice success" role="status">
          {message.success}
        </div>
      )}

      <section className="admin-panel" aria-label="Manage services">
        <div className="admin-panel-heading">
          <div>
            <h2>
              Service &amp; Location Library <span>{content.services.length}</span>
            </h2>
            <p>
              Create standalone services or location-specific pages (e.g. Love Problem Solution in Delhi, Mumbai, Canada, UK).
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="admin-button secondary"
              disabled={pending || content.services.length >= 200}
              onClick={() =>
                setEditing({
                  id: crypto.randomUUID(),
                  slug: "",
                  title: "",
                  text: "",
                  content: "",
                  img: "/assets/img/service/love-problem-realistic.webp",
                  group: "love",
                  visible: true,
                })
              }
            >
              <Plus size={18} /> Add main service
            </button>
            <button
              className="admin-button secondary"
              style={{ borderColor: "rgba(227, 182, 92, 0.4)", color: "var(--gold-light)" }}
              disabled={pending || content.services.length >= 200}
              onClick={() =>
                setEditing({
                  id: crypto.randomUUID(),
                  parentId: mainServices[0]?.id || "love-1",
                  location: "",
                  slug: "",
                  title: "",
                  text: "",
                  content: "",
                  img: mainServices[0]?.img || "/assets/img/service/love-problem-realistic.webp",
                  group: mainServices[0]?.group || "love",
                  visible: true,
                })
              }
            >
              <MapPin size={16} /> + Add location page
            </button>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-search">
            <Search size={18} />
            <input
              aria-label="Search services or locations"
              placeholder="Search by title, location (Delhi, Canada, Mumbai), or slug…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter by type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All pages ({content.services.length})</option>
            <option value="main">Main services only ({mainServices.length})</option>
            <option value="location">Location pages only ({locationServices.length})</option>
            <option value="love">Love &amp; Marriage</option>
            <option value="life">Family, Career &amp; Life</option>
          </select>
        </div>

        <div className="admin-list-labels">
          <span>PAGE &amp; LOCATION</span>
          <span>STATUS &amp; ACTIONS</span>
        </div>

        <div className="admin-service-list">
          {filtered.map((service) => {
            const isLocation = !!service.parentId;
            const parent = isLocation
              ? content.services.find((s) => s.id === service.parentId || s.slug === service.parentId)
              : null;
            const childLocations = !isLocation
              ? content.services.filter((s) => s.parentId === service.id || s.parentId === service.slug)
              : [];
            const siblings = content.services.filter((s) => s.group === service.group);

            return (
              <article
                className={`admin-service-row ${isLocation ? "admin-service-row--location" : ""}`}
                key={service.id}
                style={isLocation ? { borderLeft: "3px solid rgba(227, 182, 92, 0.6)", paddingLeft: "14px" } : {}}
              >
                <img
                  src={service.img}
                  alt=""
                  width={112}
                  height={84}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="admin-service-info">
                  <div className="admin-category-row">
                    <span className="admin-category">{GROUP_LABELS[service.group]}</span>
                    {isLocation ? (
                      <span
                        className="admin-service-slug"
                        style={{ color: "var(--gold)", fontWeight: 600 }}
                      >
                        📍 Location: {service.location || "City/Country"} (Under: {parent?.title || "Main Service"})
                      </span>
                    ) : (
                      <span className="admin-service-slug">
                        /services/{service.slug || slugify(service.title)}
                      </span>
                    )}
                  </div>
                  <h3>
                    {isLocation && <MapPin size={15} style={{ display: "inline", marginRight: "4px", color: "var(--gold)" }} />}
                    {service.title}
                  </h3>
                  <p>{service.text}</p>
                  {!isLocation && childLocations.length > 0 && (
                    <small style={{ color: "var(--gold-light)", display: "block", marginTop: "4px" }}>
                      🌍 {childLocations.length} location pages linked ({childLocations.map((c) => c.location || c.title.split(" in ")[1]).filter(Boolean).slice(0, 4).join(", ")}
                      {childLocations.length > 4 ? "…" : ""})
                    </small>
                  )}
                </div>
                <div className="admin-row-actions">
                  {!isLocation && (
                    <button
                      type="button"
                      className="admin-edit-button"
                      style={{ background: "rgba(227, 182, 92, 0.15)", borderColor: "rgba(227, 182, 92, 0.35)", color: "var(--gold-light)" }}
                      title="Add city/country page under this service"
                      onClick={() =>
                        setEditing({
                          id: crypto.randomUUID(),
                          parentId: service.id,
                          location: "",
                          slug: "",
                          title: "",
                          text: "",
                          content: "",
                          img: service.img,
                          group: service.group,
                          visible: true,
                        })
                      }
                    >
                      <MapPin size={13} /> + Location
                    </button>
                  )}
                  <a
                    href={`/services/${service.slug || slugify(service.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-page-link"
                    title="Open live page in new tab"
                  >
                    <ExternalLink size={14} /> View page
                  </a>
                  <button
                    disabled={pending}
                    className={`admin-visibility ${service.visible ? "visible" : ""}`}
                    onClick={() =>
                      updateServices(
                        content.services.map((s) =>
                          s.id === service.id ? { ...s, visible: !s.visible } : s
                        )
                      )
                    }
                    aria-label={`${service.visible ? "Hide" : "Show"} ${service.title}`}
                    aria-pressed={service.visible}
                  >
                    {service.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    {service.visible ? "Visible" : "Hidden"}
                  </button>
                  <div className="admin-order">
                    <button
                      className="admin-icon-button"
                      disabled={pending || siblings[0].id === service.id}
                      onClick={() => move(service.id, -1)}
                      aria-label={`Move ${service.title} up`}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="admin-icon-button"
                      disabled={pending || siblings[siblings.length - 1].id === service.id}
                      onClick={() => move(service.id, 1)}
                      aria-label={`Move ${service.title} down`}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <button
                    className="admin-edit-button"
                    disabled={pending}
                    onClick={() => setEditing({ ...service })}
                  >
                    <Pencil size={15} /> Edit
                  </button>
                </div>
              </article>
            );
          })}
          {!filtered.length && (
            <div className="admin-empty">
              <Search size={30} />
              <h3>No services or location pages found</h3>
              <p>Try another search or add a new service or location page.</p>
            </div>
          )}
        </div>
        <div className="admin-panel-footer">
          Showing {filtered.length} of {content.services.length} pages (
          {mainServices.length} main services, {locationServices.length} location pages){" "}
          <span>Changes go live when you publish.</span>
        </div>
      </section>
      <p className="admin-bottom-note">
        <CheckCircle2 size={15} /> Your content and location pages are stored securely in Supabase.
      </p>
      {editing && (
        <ServiceEditor
          service={editing}
          allServices={content.services}
          existing={content.services.some((s) => s.id === editing.id)}
          onClose={() => setEditing(null)}
          onApply={async (service) => {
            const nextServices = content.services.some((s) => s.id === service.id)
              ? content.services.map((s) => (s.id === service.id ? service : s))
              : [...content.services, service];
            const nextContent = { ...content, services: nextServices };
            setContent(nextContent);
            const result = await publishServices(nextContent);
            if (result.content) {
              setContent(result.content);
              setSaved(JSON.stringify(result.content));
              setMessage({
                success: `✅ "${service.title}" saved & published to live website navigation!`,
              });
              setEditing(null);
              return { success: true };
            } else {
              const err = result.error || "Could not publish changes.";
              setMessage({ error: err });
              return { error: err };
            }
          }}
          onDelete={async () => {
            const nextServices = content.services.filter((s) => s.id !== editing.id);
            const nextContent = { ...content, services: nextServices };
            setContent(nextContent);
            const result = await publishServices(nextContent);
            if (result.content) {
              setContent(result.content);
              setSaved(JSON.stringify(result.content));
              setMessage({ success: "Page removed and published." });
            }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ServiceEditor({
  service,
  allServices,
  existing,
  onClose,
  onApply,
  onDelete,
}: {
  service: ManagedService;
  allServices: ManagedService[];
  existing: boolean;
  onClose: () => void;
  onApply: (s: ManagedService) => Promise<{ success?: boolean; error?: string } | void> | void;
  onDelete: () => Promise<void> | void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const mainServices = allServices.filter((s) => !s.parentId);

  const [draft, setDraft] = useState({
    ...service,
    parentId: service.parentId || null,
    location: service.location || "",
    slug: service.slug || slugify(service.title),
    content: service.content || service.text,
  });
  const [isLocationPage, setIsLocationPage] = useState(!!service.parentId);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showContentPreview, setShowContentPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const shortDescRef = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);

  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("image", file);
      const result = await uploadServiceImage(form);
      if (result.path) setDraft((d) => ({ ...d, img: result.path! }));
      else setError(result.error || "Upload failed.");
    } catch {
      setError("The upload was interrupted. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // Helper to auto-fill location title, slug, description, and remedies
  function handleAutoFillLocation(parentServiceId: string, locationName: string) {
    const parent = mainServices.find((s) => s.id === parentServiceId);
    if (!parent || !locationName.trim()) return;

    const loc = locationName.trim();
    const cleanParentTitle = parent.title.replace(/\s+Astrologer$/i, "");
    const generatedTitle = `${cleanParentTitle} in ${loc}`;
    const generatedSlug = slugify(generatedTitle);
    const shortDesc = `Get 100% genuine Vedic astrology remedies for ${cleanParentTitle.toLowerCase()} in ${loc}. Consult world-famous Astrologer Kali Charan for quick results.`;
    const fullContent = `Are you facing difficult relationship or life challenges in ${loc}? Celebrated Indian Vedic Astrologer Kali Charan provides specialized Kundli analysis, planetary dosha shanti, and confidential spiritual remedies for individuals and couples across ${loc}.

### Why Consult Astrologer Kali Charan in ${loc}
- **Proven Track Record:** Over 25+ years of verified astrological expertise and 98,000+ satisfied clients worldwide.
- **Accurate Planetary Diagnosis:** Identifying afflicted houses (5th house of love, 7th house of marriage) and malefic transits.
- **Ethical Vedic Remedies:** Pure sattvic vidhi, personalized yantras, and divine mantras with 100% privacy.

### Direct Consultation for ${loc} Residents
Astrologer Kali Charan provides direct telephonic and WhatsApp consultations for clients in ${loc}. Connect directly today for compassionate, effective guidance within hours.`;

    setDraft((d) => ({
      ...d,
      parentId: parentServiceId,
      location: loc,
      title: generatedTitle,
      slug: generatedSlug,
      text: shortDesc,
      content: fullContent,
      img: parent.img,
      group: parent.group,
    }));
  }

  return (
    <dialog
      className="admin-dialog admin-dialog--wide"
      ref={dialog}
      aria-labelledby="service-editor-title"
      onCancel={(event) => {
        if (uploading) event.preventDefault();
        else onClose();
      }}
    >
      <div className="admin-dialog-heading">
        <div>
          <span className="admin-eyebrow">SERVICE &amp; LOCATION LANDING PAGE</span>
          <h2 id="service-editor-title">
            {existing
              ? isLocationPage
                ? "Edit location page"
                : "Edit service page"
              : isLocationPage
              ? "Create new location page"
              : "Create new service page"}
          </h2>
        </div>
        <button
          className="admin-icon-button"
          disabled={uploading}
          onClick={onClose}
          aria-label="Close editor"
        >
          <X size={22} />
        </button>
      </div>

      <form
        className="admin-form"
        onSubmit={async (event) => {
          event.preventDefault();
          const pId = isLocationPage ? draft.parentId || mainServices[0]?.id : null;
          const parent = pId ? mainServices.find((s) => s.id === pId) : null;
          const cleanParent = parent ? cleanPlainField(parent.title).replace(/\s+Astrologer$/i, "") : "";
          const loc = isLocationPage ? cleanPlainField(draft.location || "") || null : null;

          let title = cleanPlainField(draft.title);
          if (isLocationPage && !title && cleanParent && loc) {
            title = `${cleanParent} in ${loc}`;
          }
          if (!title) {
            setError("Please provide a title for this service/location page.");
            return;
          }

          const finalSlug = slugify(draft.slug || title);
          if (!finalSlug) {
            setError("Please provide a valid URL slug.");
            return;
          }

          let text = cleanRichHtmlArtifacts(draft.text).trim();
          if (isLocationPage && !text && cleanParent && loc) {
            text = `Get 100% genuine Vedic astrology remedies for ${cleanParent.toLowerCase()} in ${loc}. Consult world-famous Astrologer Kali Charan for quick results.`;
          }
          if (!text) text = title;

          let content = cleanRichHtmlArtifacts(draft.content).trim() || text;
          if (isLocationPage && (!draft.content || !draft.content.trim()) && cleanParent && loc) {
            content = `Are you facing difficult relationship or life challenges in ${loc}? Celebrated Indian Vedic Astrologer Kali Charan provides specialized Kundli analysis, planetary dosha shanti, and confidential spiritual remedies for individuals and couples across ${loc}.\n\n### Why Consult Astrologer Kali Charan in ${loc}\n- **Proven Track Record:** Over 25+ years of verified astrological expertise and 98,000+ satisfied clients worldwide.\n- **Accurate Planetary Diagnosis:** Identifying afflicted houses (5th house of love, 7th house of marriage) and malefic transits.\n- **Ethical Vedic Remedies:** Pure sattvic vidhi, personalized yantras, and divine mantras with 100% privacy.\n\n### Direct Consultation for ${loc} Residents\nAstrologer Kali Charan provides direct telephonic and WhatsApp consultations for clients in ${loc}. Connect directly today for compassionate, effective guidance.`;
          }

          setSaving(true);
          setError("");
          try {
            const res = await onApply({
              ...draft,
              slug: finalSlug,
              title,
              text,
              content,
              parentId: pId,
              location: loc,
            });
            if (res && res.error) {
              setError(res.error);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed. Please retry.");
          } finally {
            setSaving(false);
          }
        }}
      >
        {/* Page Type Selector */}
        <div style={{ background: "rgba(227, 182, 92, 0.08)", border: "1px solid rgba(227, 182, 92, 0.25)", padding: "14px", borderRadius: "10px", marginBottom: "16px" }}>
          <strong style={{ display: "block", color: "var(--gold-light)", marginBottom: "8px", fontSize: "14px" }}>
            Select Page Type:
          </strong>
          <div style={{ display: "flex", gap: "20px" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="radio"
                name="page-type"
                checked={!isLocationPage}
                onChange={() => {
                  setIsLocationPage(false);
                  setDraft((d) => ({ ...d, parentId: null, location: "" }));
                }}
              />
              <span>Main Service Page (e.g. Love Problem Solution)</span>
            </label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="radio"
                name="page-type"
                checked={isLocationPage}
                onChange={() => {
                  setIsLocationPage(true);
                  if (!draft.parentId && mainServices.length > 0) {
                    setDraft((d) => ({ ...d, parentId: mainServices[0].id }));
                  }
                }}
              />
              <span>📍 Location / City Page (e.g. In Delhi, Canada, Mumbai)</span>
            </label>
          </div>
        </div>

        {/* Location-Specific Controls */}
        {isLocationPage && (
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "10px", marginBottom: "16px", border: "1px dashed rgba(227,182,92,0.3)" }}>
            <label htmlFor="service-parent">Parent Service (Which service does this location belong to?)</label>
            <select
              id="service-parent"
              value={draft.parentId || ""}
              onChange={(e) => {
                const pId = e.target.value;
                setDraft((d) => ({ ...d, parentId: pId }));
                if (draft.location) handleAutoFillLocation(pId, draft.location);
              }}
              required
            >
              <option value="">-- Choose Parent Service --</option>
              {mainServices.map((parent) => (
                <option value={parent.id} key={parent.id}>
                  {parent.title} ({GROUP_LABELS[parent.group]})
                </option>
              ))}
            </select>

            <label htmlFor="service-location" style={{ marginTop: "10px" }}>
              Location / City / Country Name
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="service-location"
                style={{ flex: 1 }}
                value={draft.location || ""}
                onChange={(e) => {
                  const loc = e.target.value;
                  const pId = draft.parentId || mainServices[0]?.id;
                  const parent = mainServices.find((s) => s.id === pId);
                  const cleanParent = parent ? parent.title.replace(/\s+Astrologer$/i, "") : "";
                  setDraft((d) => {
                    const next = { ...d, location: loc };
                    if (!d.title || d.title.includes(" in ") || d.title === cleanParent) {
                      next.title = loc.trim() ? `${cleanParent} in ${loc.trim()}` : cleanParent;
                      next.slug = slugify(next.title);
                      if (!d.text || d.text.includes("Vedic astrology remedies")) {
                        next.text = `Get 100% genuine Vedic astrology remedies for ${cleanParent.toLowerCase()} in ${loc.trim()}. Consult world-famous Astrologer Kali Charan for quick results.`;
                      }
                    }
                    return next;
                  });
                }}
                placeholder="e.g. Delhi, Mumbai, Canada, UK, USA, Jaipur..."
                required
              />
              <button
                type="button"
                className="admin-button secondary"
                onClick={() => handleAutoFillLocation(draft.parentId || mainServices[0]?.id, draft.location || "")}
                disabled={!draft.parentId || !draft.location}
                title="Automatically generate title, slug, description, and remedies for this location"
              >
                <Sparkles size={14} /> Auto-Generate
              </button>
            </div>
            <small style={{ color: "var(--gold-light)", display: "block", marginTop: "4px" }}>
              Tip: Click "Auto-Generate" to automatically create the Title, URL slug, and complete Vedic content for this city/country!
            </small>
          </div>
        )}

        <div className="admin-editor-image">
          <img
            src={draft.img}
            alt="Service image preview"
            width={600}
            height={450}
            referrerPolicy="no-referrer"
          />
          <button
            className="admin-button secondary"
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? <LoaderCircle size={17} className="admin-spin" /> : <ImagePlus size={17} />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>
        <input
          className="admin-hidden"
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-label="Upload service image"
          onChange={(e) => void upload(e.target.files?.[0])}
        />
        <small>JPG, PNG, or WebP · Up to 5 MB · Automatically optimized to 4:3</small>

        <label htmlFor="service-title">Page Title</label>
        <input
          id="service-title"
          value={draft.title}
          onChange={(e) => {
            const val = e.target.value;
            setDraft((d) => ({
              ...d,
              title: val,
              slug: !d.slug || d.slug === slugify(d.title) ? slugify(val) : d.slug,
            }));
          }}
          required
          maxLength={100}
          placeholder="e.g. Love Problem Solution in Delhi"
        />

        <label htmlFor="service-slug">
          Dedicated Page URL Slug (/services/<strong>{draft.slug || "..."}</strong>)
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            id="service-slug"
            style={{ flex: 1 }}
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
            required
            maxLength={100}
            placeholder="e.g. love-problem-solution-in-delhi"
          />
          <button
            type="button"
            className="admin-button secondary"
            onClick={() => setDraft((d) => ({ ...d, slug: slugify(d.title) }))}
          >
            Auto
          </button>
        </div>

        <label htmlFor="service-group">Category</label>
        <select
          id="service-group"
          value={draft.group}
          onChange={(e) => setDraft({ ...draft, group: e.target.value as "love" | "life" })}
        >
          <option value="love">Love &amp; Marriage</option>
          <option value="life">Family, Career &amp; Life</option>
        </select>

        <label htmlFor="service-image">Image URL or local path</label>
        <input
          id="service-image"
          value={draft.img}
          onChange={(e) => setDraft({ ...draft, img: e.target.value })}
          maxLength={2048}
          required
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
          <label htmlFor="service-short-desc" style={{ margin: 0 }}>
            Card Short Description (shown on listing badges and SEO descriptions)
          </label>
        </div>
        <FormatToolbar
          textareaRef={shortDescRef}
          value={draft.text}
          onChange={(text) => setDraft((d) => ({ ...d, text }))}
          allowHeadings={false}
        />
        <textarea
          ref={shortDescRef}
          id="service-short-desc"
          rows={3}
          value={draft.text}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          required
          maxLength={2000}
          placeholder="Brief summary of this service or location consultation. You can insert [links](url) or bold text..."
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
          <label htmlFor="service-full-content" style={{ margin: 0, fontWeight: 700, color: "var(--gold-light)" }}>
            Dedicated Page Full Description &amp; Remedies (Visual WYSIWYG Editor)
          </label>
        </div>
        <RichWysiwygEditor
          value={draft.content}
          onChange={(content) => setDraft((d) => ({ ...d, content }))}
          title={draft.title}
          placeholder="Write detailed Vedic astrology explanation, remedies, and benefits. Click Bold (B) or Headings to format instantly directly on screen!"
        />
        <small style={{ display: "block", marginTop: "6px", color: "var(--a-muted)" }}>
          💡 <strong>Direct WYSIWYG Editor:</strong> Bold (<strong>B</strong>), Italic (<em>I</em>), Headings (<strong>H2/H3</strong>), Bullets (<strong>•</strong>), and Hyperlinks (<strong>🔗</strong>) directly screen par format hote hain jaisa aap type karte hain.
        </small>

        <label className="admin-checkbox" style={{ marginTop: "12px" }}>
          <input
            type="checkbox"
            checked={draft.visible}
            onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
          />
          Show this page on the website and navigation menus
        </label>

        {error && (
          <p role="alert" className="admin-field-error">
            {error}
          </p>
        )}
        <div className="admin-dialog-footer">
          <div>
            {existing &&
              (confirmDelete ? (
                <button
                  type="button"
                  className="admin-delete"
                  disabled={uploading}
                  onClick={onDelete}
                >
                  Confirm removal
                </button>
              ) : (
                <button
                  type="button"
                  className="admin-delete"
                  disabled={uploading}
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 size={16} /> Delete page
                </button>
              ))}
          </div>
          <button
            type="button"
            className="admin-button secondary"
            onClick={onClose}
            disabled={uploading || saving}
          >
            Cancel
          </button>
          <button
            className="admin-button primary"
            disabled={uploading || saving}
            type="submit"
          >
            {saving ? <LoaderCircle size={17} className="admin-spin" /> : <Save size={17} />}
            {saving ? "Saving & Publishing to Website…" : "Save & Publish to Live Website"}
          </button>
        </div>
        <small style={{ color: "var(--gold-light)", marginTop: "6px", display: "block" }}>
          ✅ Clicking &quot;Save &amp; Publish&quot; immediately saves to database and updates the main navigation.
        </small>
      </form>
    </dialog>
  );
}
