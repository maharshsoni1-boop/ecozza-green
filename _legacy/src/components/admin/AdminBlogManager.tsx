"use client";

import React, { useState } from "react";
import { saveBlogPostAction, deleteBlogPostAction } from "@/app/actions/admin-blog";
import { Plus, Edit2, Trash2, Check, AlertCircle, FileText } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  author: string;
  isPublished: boolean;
  publishedAt: Date | null;
}

export function AdminBlogManager({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    contentMarkdown: "",
    coverImageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
    author: "Ecozza Green Agronomy Team",
    isPublished: true,
  });

  const handleOpenAdd = () => {
    setEditingPost(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      contentMarkdown: "",
      coverImageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      author: "Ecozza Green Agronomy Team",
      isPublished: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      contentMarkdown: post.contentMarkdown,
      coverImageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      author: post.author,
      isPublished: post.isPublished,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await saveBlogPostAction({
      id: editingPost?.id,
      ...form,
    });

    if (res.success) {
      setShowModal(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to save post");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const res = await deleteBlogPostAction(id);
    if (res.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-xs text-[#58635B]">
          Showing <strong>{posts.length}</strong> agronomic articles and educational guides
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEBE1]">
              <div className="flex items-center gap-2">
                <span className="badge-carbon text-[10px]">
                  {post.isPublished ? "Published" : "Draft"}
                </span>
                <span className="text-[11px] text-[#58635B] font-mono">/{post.slug}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="p-1.5 text-[#58635B] hover:text-[#121614] hover:bg-[#EFEBE1] rounded-lg"
                  title="Edit article"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#121614] font-heading">{post.title}</h3>
              <p className="text-xs text-[#58635B] mt-1">{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold font-heading text-[#121614]">
              {editingPost ? "Edit Agronomy Article" : "Compose Agronomy Article"}
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#121614]">Article Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    setForm({ ...form, title, slug: form.slug || slug });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#121614]">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#121614]">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#121614]">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#121614]">Markdown Content *</label>
                <textarea
                  rows={8}
                  required
                  value={form.contentMarkdown}
                  onChange={(e) => setForm({ ...form, contentMarkdown: e.target.value })}
                  placeholder="### Soil Porosity Insights&#10;&#10;Write markdown content here..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5] font-mono text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[#1E3A2B]"
                />
                <span className="font-semibold text-[#121614]">Publish publicly immediately</span>
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white font-bold"
                >
                  {loading ? "Saving..." : "Save Article"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E0D6] text-[#58635B]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
