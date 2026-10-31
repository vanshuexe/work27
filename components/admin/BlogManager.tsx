"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Search,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { publishBlogs, uploadBlogImage } from "@/app/admin/actions";
import { calculateReadTime, slugify, type BlogContent, type ManagedBlog } from "@/lib/admin/types";

const SUGGESTED_CATEGORIES = [
  "Love Problem",
  "Love Marriage",
  "Husband-Wife Problem",
  "Vashikaran Specialist",
  "Family Problem",
  "Divorce Problem",
  "Child Problem",
  "Business & Career",
  "Vedic Astrology",
  "Astrological Remedies",
];

export default function BlogManager({ initialContent }: { initialContent: BlogContent }) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(JSON.stringify(initialContent));
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");
  const [editing, setEditing] = useState<ManagedBlog | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});

  const dirty = JSON.stringify(content) !== saved;
  const visibleCount = content.blogs.filter((b) => b.visible).length;
  const hiddenCount = content.blogs.length - visibleCount;

  // Extract unique categories from current blogs for filter dropdown
  const allCategories = Array.from(new Set(content.blogs.map((b) => b.category).filter(Boolean)));

  const filtered = content.blogs.filter((blog) => {
    const matchesQuery =
      blog.title.toLowerCase().includes(query.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      blog.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "visible" && blog.visible) ||
      (statusFilter === "hidden" && !blog.visible);
    return matchesQuery && matchesCategory && matchesStatus;
  });

  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (dirty) event.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function updateBlogs(blogs: ManagedBlog[]) {
    setContent((c) => ({ ...c, blogs }));
    setMessage({});
  }

  function move(id: string, direction: -1 | 1) {
    const blogs = [...content.blogs];
    const index = blogs.findIndex((b) => b.id === id);
    const target = index + direction;
    if (target < 0 || target >= blogs.length) return;
    [blogs[index], blogs[target]] = [blogs[target], blogs[index]];
    updateBlogs(blogs);
  }

  function toggleVisibility(id: string) {
    updateBlogs(content.blogs.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  }

  function deleteBlog(id: string) {
    updateBlogs(content.blogs.filter((b) => b.id !== id));
  }

  async function publish() {
    setPending(true);
    setMessage({});
    try {
      const result = await publishBlogs(content);
      if (result.content) {
        setContent(result.content);
        setSaved(JSON.stringify(result.content));
        setMessage({ success: "Blog changes published. Your website is up to date." });
      } else {
        setMessage({ error: result.error || "Could not publish changes." });
      }
    } catch {
      setMessage({ error: "Connection lost. Your changes are still here; please try again." });
    } finally {
      setPending(false);
    }
  }

  function startNewBlog() {
    const newId = crypto.randomUUID();
    const today = new Date().toISOString().slice(0, 10);
    setEditing({
      id: newId,
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      img: "/assets/img/service/love-problem-realistic.webp",
      category: "Vedic Astrology",
      author: "Astrologer Kali Charan",
      date: today,
      readTime: "5 min read",
      visible: true,
    });
  }

  return (
    <div className="admin-content">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Your blogs & articles</h1>
          <p>Create, update, or remove blogs to share astrological wisdom and solutions.</p>
        </div>
        <button className="admin-button primary" disabled={!dirty || pending} onClick={publish}>
          {pending ? <LoaderCircle className="admin-spin" size={18} /> : <Save size={18} />}
          {pending ? "Publishing…" : "Publish changes"}
        </button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-icon">
            <BookOpen size={21} />
          </span>
          <div>
            <span>Total blogs</span>
            <strong>{content.blogs.length}</strong>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon green">
            <Eye size={21} />
          </span>
          <div>
            <span>Published on website</span>
            <strong>{visibleCount}</strong>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon amber">
            <EyeOff size={21} />
          </span>
          <div>
            <span>Drafts / Hidden</span>
            <strong>{hiddenCount}</strong>
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

      {message.error && <div className="admin-notice error" role="alert">{message.error}</div>}
      {message.success && <div className="admin-notice success" role="status">{message.success}</div>}

      <section className="admin-panel" aria-label="Manage blogs">
        <div className="admin-panel-heading">
          <div>
            <h2>
              Blog library <span>{content.blogs.length}</span>
            </h2>
            <p>Write an article, update content, or delete a blog.</p>
          </div>
          <button
            className="admin-button secondary"
            disabled={pending || content.blogs.length >= 100}
            onClick={startNewBlog}
          >
            <Plus size={18} /> Add blog
          </button>
        </div>

        <div className="admin-filters">
          <div className="admin-search">
            <Search size={18} />
            <input
              aria-label="Search blogs"
              placeholder="Search blogs by title, excerpt or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "visible" | "hidden")}
          >
            <option value="all">All status</option>
            <option value="visible">Published only</option>
            <option value="hidden">Drafts only</option>
          </select>
        </div>

        <div className="admin-list-labels">
          <span>ARTICLE</span>
          <span>STATUS & ACTIONS</span>
        </div>

        <div className="admin-service-list">
          {filtered.map((blog, idx) => (
            <article className="admin-service-row" key={blog.id}>
              <img
                src={blog.img}
                alt=""
                width={112}
                height={84}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="admin-service-info">
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
                  <span className="admin-category">{blog.category}</span>
                  <span style={{ fontSize: "10px", color: "var(--a-muted)" }}>• {blog.date}</span>
                  <span style={{ fontSize: "10px", color: "var(--a-muted)" }}>• {blog.readTime}</span>
                </div>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div style={{ marginTop: "4px", fontSize: "10px", color: "#8b919d" }}>
                  Slug: <code>/blog/{blog.slug}</code>
                </div>
              </div>

              <div className="admin-row-actions">
                <button
                  disabled={pending}
                  className={`admin-visibility ${blog.visible ? "visible" : ""}`}
                  onClick={() => toggleVisibility(blog.id)}
                  aria-label={`${blog.visible ? "Hide" : "Show"} ${blog.title}`}
                  aria-pressed={blog.visible}
                >
                  {blog.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  {blog.visible ? "Published" : "Draft"}
                </button>
                <div className="admin-order">
                  <button
                    className="admin-icon-button"
                    disabled={pending || idx === 0}
                    onClick={() => move(blog.id, -1)}
                    aria-label={`Move ${blog.title} up`}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    className="admin-icon-button"
                    disabled={pending || idx === filtered.length - 1}
                    onClick={() => move(blog.id, 1)}
                    aria-label={`Move ${blog.title} down`}
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
                <button
                  className="admin-edit-button"
                  disabled={pending}
                  onClick={() => setEditing({ ...blog })}
                >
                  <Pencil size={15} /> Edit
                </button>
              </div>
            </article>
          ))}

          {!filtered.length && (
            <div className="admin-empty">
              <Search size={30} />
              <h3>No blogs found</h3>
              <p>Try another search or click &quot;Add blog&quot; to write a new article.</p>
            </div>
          )}
        </div>

        <div className="admin-panel-footer">
          Showing {filtered.length} of {content.blogs.length} blogs
          <span>Changes go live when you click &quot;Publish changes&quot;.</span>
        </div>
      </section>

      <p className="admin-bottom-note">
        <CheckCircle2 size={15} /> Your blogs are stored securely in Supabase CMS.
      </p>

      {editing && (
        <BlogEditor
          blog={editing}
          existing={content.blogs.some((b) => b.id === editing.id)}
          onClose={() => setEditing(null)}
          onApply={(updated) => {
            updateBlogs(
              content.blogs.some((b) => b.id === updated.id)
                ? content.blogs.map((b) => (b.id === updated.id ? updated : b))
                : [updated, ...content.blogs]
            );
            setEditing(null);
          }}
          onDelete={() => {
            deleteBlog(editing.id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function BlogEditor({
  blog,
  existing,
  onClose,
  onApply,
  onDelete,
}: {
  blog: ManagedBlog;
  existing: boolean;
  onClose: () => void;
  onApply: (b: ManagedBlog) => void;
  onDelete: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(blog);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);

  function handleTitleChange(title: string) {
    if (!existing && (!draft.slug || draft.slug === slugify(draft.title))) {
      setDraft((d) => ({ ...d, title, slug: slugify(title) }));
    } else {
      setDraft((d) => ({ ...d, title }));
    }
  }

  function handleContentChange(content: string) {
    setDraft((d) => ({ ...d, content, readTime: calculateReadTime(content) }));
  }

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
      const result = await uploadBlogImage(form);
      if (result.path) {
        setDraft((d) => ({ ...d, img: result.path! }));
      } else {
        setError(result.error || "Upload failed.");
      }
    } catch {
      setError("The upload was interrupted. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const title = draft.title.trim();
    if (!title) {
      setError("Please enter a blog title.");
      return;
    }

    const cleanSlug = slugify(draft.slug || title);
    if (!cleanSlug) {
      setError("Please provide a valid slug.");
      return;
    }

    const excerpt = draft.excerpt.trim();
    if (!excerpt) {
      setError("Please provide a short excerpt/summary.");
      return;
    }

    const content = draft.content.trim();
    if (!content) {
      setError("Please enter the article content.");
      return;
    }

    onApply({
      ...draft,
      title,
      slug: cleanSlug,
      excerpt,
      content,
      readTime: draft.readTime || calculateReadTime(content),
    });
  }

  return (
    <dialog
      className="admin-dialog"
      ref={dialog}
      aria-labelledby="blog-editor-title"
      style={{ maxWidth: "700px" }}
      onCancel={(event) => {
        if (uploading) event.preventDefault();
        else onClose();
      }}
    >
      <div className="admin-dialog-heading">
        <div>
          <span className="admin-eyebrow">BLOG POST</span>
          <h2 id="blog-editor-title">{existing ? "Edit blog article" : "Write a new blog"}</h2>
        </div>
        <button className="admin-icon-button" disabled={uploading} onClick={onClose} aria-label="Close editor">
          <X size={22} />
        </button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-editor-image" style={{ height: "230px" }}>
          <img src={draft.img} alt="Blog cover preview" width={700} height={400} referrerPolicy="no-referrer" />
          <button
            className="admin-button secondary"
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? <LoaderCircle size={17} className="admin-spin" /> : <ImagePlus size={17} />}
            {uploading ? "Uploading…" : "Upload cover image"}
          </button>
        </div>
        <input
          className="admin-hidden"
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-label="Upload blog image"
          onChange={(e) => void upload(e.target.files?.[0])}
        />
        <small>JPG, PNG, or WebP · Up to 5 MB · Automatically optimized</small>

        <label htmlFor="blog-title">Blog Title</label>
        <input
          id="blog-title"
          value={draft.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. Effective Astrological Remedies for Love Problem"
          required
          maxLength={150}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label htmlFor="blog-slug">URL Slug</label>
            <input
              id="blog-slug"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
              placeholder="e.g. effective-remedies-love-problem"
              required
              maxLength={100}
            />
            <small>Will be accessible at: /blog/{draft.slug || "slug"}</small>
          </div>

          <div>
            <label htmlFor="blog-category">Category</label>
            <input
              id="blog-category"
              list="category-suggestions"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="Select or type category"
              required
              maxLength={60}
            />
            <datalist id="category-suggestions">
              {SUGGESTED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          <div>
            <label htmlFor="blog-author">Author</label>
            <input
              id="blog-author"
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              required
              maxLength={80}
            />
          </div>
          <div>
            <label htmlFor="blog-date">Date</label>
            <input
              id="blog-date"
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="blog-readtime">Read Time</label>
            <input
              id="blog-readtime"
              value={draft.readTime}
              onChange={(e) => setDraft({ ...draft, readTime: e.target.value })}
              required
              maxLength={30}
            />
          </div>
        </div>

        <label htmlFor="blog-image">Cover image URL or local path</label>
        <input
          id="blog-image"
          value={draft.img}
          onChange={(e) => setDraft({ ...draft, img: e.target.value })}
          maxLength={2048}
          required
        />

        <label htmlFor="blog-excerpt">Excerpt / Short Summary</label>
        <textarea
          id="blog-excerpt"
          rows={3}
          value={draft.excerpt}
          onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          placeholder="Brief 1-2 sentence overview shown on blog cards..."
          required
          maxLength={600}
        />

        <label htmlFor="blog-content">Article Content</label>
        <textarea
          id="blog-content"
          rows={10}
          value={draft.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write your article content here. You can use standard paragraphs, ### Subheadings, and - bullet points."
          required
          maxLength={30000}
        />
        <small>Tip: Use blank lines between paragraphs, &quot;### Subheading&quot; for section titles, and &quot;- Item&quot; for lists.</small>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={draft.visible}
            onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
          />
          Show and publish this blog on the website
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
                  style={{ background: "#a3263c", color: "#fff", padding: "8px 14px", borderRadius: "6px" }}
                >
                  <Trash2 size={16} /> Confirm deletion
                </button>
              ) : (
                <button
                  type="button"
                  className="admin-delete"
                  disabled={uploading}
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 size={16} /> Delete blog
                </button>
              ))}
          </div>
          <button type="button" className="admin-button secondary" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button className="admin-button primary" disabled={uploading}>
            <Check size={17} /> Apply changes
          </button>
        </div>
        <small>Apply adds this blog to your draft. Click &quot;Publish changes&quot; on the dashboard to make it live.</small>
      </form>
    </dialog>
  );
}

