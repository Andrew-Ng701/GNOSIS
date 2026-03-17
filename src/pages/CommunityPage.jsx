import {
  FileText,
  Flame,
  MessageCircle,
  Plus,
  Bookmark,
  ChevronUp,
  X,
  Filter,
} from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import { getPosts, getProfile, savePosts } from "../lib/storage";
import { uid } from "../lib/helpers";

const filters = ["All", "Milestone", "Resource", "Tip"];

const categoryColors = {
  Milestone: "bg-emerald-100 text-emerald-700",
  Resource: "bg-sky-100 text-sky-700",
  Tip: "bg-violet-100 text-violet-700",
};

export default function CommunityPage() {
  const profile = getProfile();
  const [posts, setPosts] = useState(getPosts());
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const [draft, setDraft] = useState({
    category: "Tip",
    title: "",
    body: "",
    attachment: "",
  });

  const filteredPosts = useMemo(() => {
    const next =
      activeFilter === "All"
        ? posts
        : posts.filter((post) => post.category === activeFilter);

    return [...next].sort((a, b) => {
      const aScore = (a.upvotes || 0) + (a.replies || 0);
      const bScore = (b.upvotes || 0) + (b.replies || 0);
      return bScore - aScore;
    });
  }, [activeFilter, posts]);

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
        upvotes: upvoted ? post.upvotes + 1 : post.upvotes - 1,
      };
    });

    sync(next);
  }

  function toggleSave(id) {
    const next = posts.map((post) =>
      post.id === id ? { ...post, saved: !post.saved } : post,
    );
    sync(next);
  }

  function toggleExpanded(id) {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function addReply(id) {
    const next = posts.map((post) =>
      post.id === id ? { ...post, replies: (post.replies || 0) + 1 } : post,
    );
    sync(next);
  }

  function createPost() {
    if (!draft.title.trim() || !draft.body.trim()) return;

    const userName = profile.fullName?.trim() || "You";
    const location = profile.city?.trim()
      ? `${profile.city}${profile.country ? `, ${profile.country}` : ""}`
      : profile.country || "Unknown";

    const newPost = {
      id: uid("post"),
      user: userName,
      location,
      timeAgo: "Just now",
      category: draft.category,
      title: draft.title.trim(),
      body: draft.body.trim(),
      upvotes: 0,
      replies: 0,
      attachment: draft.attachment.trim() || null,
      color: categoryColors[draft.category] || categoryColors.Tip,
      upvoted: false,
      saved: false,
    };

    sync([newPost, ...posts]);
    setDraft({
      category: "Tip",
      title: "",
      body: "",
      attachment: "",
    });
    setShowCreate(false);
    setActiveFilter("All");
  }

  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Milestones, resources, and practical tips"
        right={
          <button className="secondary-btn !px-3 !py-2 text-sm">
            <Flame size={16} className="mr-1 inline-block" />
            Trends
          </button>
        }
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={
              activeFilter === filter
                ? "pill shrink-0 pill-active"
                : "pill shrink-0"
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Discover what other applicants are sharing
          </p>
          <p className="mt-1 text-xs text-brand-600">
            Filter by milestones, resources, or writing tips.
          </p>
        </div>
        <Filter size={18} className="text-brand-500" />
      </div>

      <div className="mb-4 flex justify-end">
        <button
          className="primary-btn !px-4 !py-3"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={16} className="mr-1 inline-block" />
          Create Post
        </button>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const expanded = expandedIds.includes(post.id);
          const longBody = post.body.length > 140;
          const visibleBody =
            expanded || !longBody ? post.body : `${post.body.slice(0, 140)}...`;

          return (
            <div key={post.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white">
                  {post.user
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {post.user}
                    </p>
                    <span className="text-xs text-body">· {post.location}</span>
                    <span className="text-xs text-label">· {post.timeAgo}</span>
                  </div>

                  <div className="mt-2">
                    <Badge className={post.color}>{post.category}</Badge>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-ink">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-body">
                    {visibleBody}
                  </p>

                  {longBody && (
                    <button
                      className="mt-2 text-xs font-medium text-brand-600"
                      onClick={() => toggleExpanded(post.id)}
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}

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

                    <button
                      className="inline-flex items-center gap-1.5"
                      onClick={() => addReply(post.id)}
                    >
                      <MessageCircle size={15} />
                      {post.replies}
                    </button>

                    <button
                      className={`inline-flex items-center gap-1.5 ${
                        post.saved ? "text-brand-600" : ""
                      }`}
                      onClick={() => toggleSave(post.id)}
                    >
                      <Bookmark size={15} />
                      {post.saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="mx-auto mt-12 max-w-app rounded-[28px] bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-ink">Create Post</h3>
                <p className="mt-1 text-sm text-body">
                  Share a milestone, resource, or practical tip.
                </p>
              </div>

              <button
                className="icon-btn !h-10 !w-10"
                onClick={() => setShowCreate(false)}
              >
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
                    setDraft((current) => ({
                      ...current,
                      category: e.target.value,
                    }))
                  }
                >
                  {filters
                    .filter((item) => item !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block">
                <span className="label">Title</span>
                <input
                  className="input"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  placeholder="How I improved my personal statement"
                />
              </label>

              <label className="block">
                <span className="label">Post</span>
                <textarea
                  className="input min-h-[140px] resize-none"
                  value={draft.body}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      body: e.target.value,
                    }))
                  }
                  placeholder="Write something useful for other applicants..."
                />
              </label>

              <label className="block">
                <span className="label">Attachment Name (optional)</span>
                <input
                  className="input"
                  value={draft.attachment}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      attachment: e.target.value,
                    }))
                  }
                  placeholder="essay-outline.pdf"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="secondary-btn flex-1"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button className="primary-btn flex-1" onClick={createPost}>
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
