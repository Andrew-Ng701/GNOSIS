import {
  FileText,
  Flame,
  MessageCircle,
  Plus,
  Bookmark,
  ChevronUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import { getPosts, savePosts, getProfile } from "../lib/storage";
import { uid } from "../lib/helpers";

export default function CommunityPage() {
  const profile = getProfile();
  const [posts, setPosts] = useState(getPosts());
  const [showModal, setShowModal] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    body: "",
    category: "Tip",
  });

  function sync(next) {
    setPosts(next);
    savePosts(next);
  }

  function toggleUpvote(id) {
    const next = posts.map((post) => {
      if (post.id !== id) return post;
      const upvoted = !post.upvoted;
      return {
        ...post,
        upvoted,
        upvotes: upvoted ? post.upvotes + 1 : Math.max(0, post.upvotes - 1),
      };
    });
    sync(next);
  }

  function createPost() {
    if (!draft.title.trim() || !draft.body.trim()) return;

    const nextPost = {
      id: uid("post"),
      user: profile.fullName || "You",
      location: profile.city || profile.country || "Unknown",
      timeAgo: "Just now",
      category: draft.category,
      title: draft.title.trim(),
      body: draft.body.trim(),
      upvotes: 0,
      replies: 0,
      attachment: null,
      color:
        draft.category === "Milestone"
          ? "bg-emerald-100 text-emerald-700"
          : draft.category === "Resource"
            ? "bg-sky-100 text-sky-700"
            : "bg-violet-100 text-violet-700",
      upvoted: false,
    };

    sync([nextPost, ...posts]);
    setDraft({
      title: "",
      body: "",
      category: "Tip",
    });
    setShowModal(false);
  }

  const displayPosts = useMemo(() => {
    if (!showTrends) return posts;
    return [...posts].filter((post) => post.upvotes >= 20);
  }, [posts, showTrends]);

  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Milestones, resources, and practical tips"
        right={
          <button
            className={showTrends ? "pill pill-active" : "pill"}
            onClick={() => setShowTrends((v) => !v)}
          >
            <Flame size={16} className="mr-1 inline-block" />
            Trends
          </button>
        }
      />

      <div className="mb-4 flex justify-end">
        <button
          className="primary-btn !px-4 !py-3"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} className="mr-1 inline-block" />
          Create Post
        </button>
      </div>

      <div className="space-y-4">
        {displayPosts.map((post) => (
          <div key={post.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white">
                {post.user
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{post.user}</p>
                  <span className="text-xs text-body">· {post.location}</span>
                  <span className="text-xs text-label">· {post.timeAgo}</span>
                </div>

                <div className="mt-2">
                  <Badge className={post.color}>{post.category}</Badge>
                </div>

                <h3 className="mt-3 text-base font-semibold text-ink">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body">{post.body}</p>

                {post.attachment && (
                  <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    <FileText size={16} />
                    <span>{post.attachment}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <button
                    onClick={() => toggleUpvote(post.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 ${
                      post.upvoted ? "bg-brand-50 text-brand-600" : ""
                    }`}
                  >
                    <ChevronUp size={16} />
                    {post.upvotes}
                  </button>

                  <div className="inline-flex items-center gap-1.5">
                    <MessageCircle size={15} />
                    {post.replies}
                  </div>

                  <button className="inline-flex items-center gap-1.5">
                    <Bookmark size={15} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="mx-auto mt-12 max-w-app rounded-[28px] bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Create New Post</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="label">Category</span>
                <select
                  className="input"
                  value={draft.category}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  <option value="Tip">Tip</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Resource">Resource</option>
                </select>
              </label>

              <label className="block">
                <span className="label">Title</span>
                <input
                  className="input"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Share something useful"
                />
              </label>

              <label className="block">
                <span className="label">Content</span>
                <textarea
                  className="input min-h-[120px]"
                  value={draft.body}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, body: e.target.value }))
                  }
                  placeholder="Write your post..."
                />
              </label>

              <button className="primary-btn w-full" onClick={createPost}>
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
