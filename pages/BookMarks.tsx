"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookMarks({ user }: { user: any }) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // 🔹 Fetch bookmarks from DB
  const fetchBookmarks = async () => {
    if (!user?.sub) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.sub)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };
  // 🔹 Load + realtime sync across ALL tabs
useEffect(() => {
  if (!user?.sub) return;

  fetchBookmarks();

  const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${user.sub}`,
      },
      () => {
        fetchBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user?.sub, fetchBookmarks]);


  // 🔹 Add bookmark (instant same‑tab update + realtime other tabs)
  const addBookmark = async () => {
    if (!title || !url) return;

    const { data } = await supabase
      .from("bookmarks")
      .insert({ title, url, user_id: user.sub })
      .select()
      .single();

    // ✅ instant UI update in CURRENT tab
    if (data) setBookmarks((prev) => [data, ...prev]);

    setTitle("");
    setUrl("");
  };

  // 🔹 Delete bookmark (instant same‑tab update + realtime other tabs)
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);

    // ✅ instant UI update in CURRENT tab
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (!user?.sub)
    return <p className="text-center mt-10 text-gray-500">Loading user...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">My Bookmarks</h2>
      {/* Add Form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Add
        </button>
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <p className="text-center text-gray-500">No bookmarks yet.</p>
      )}

      {/* List */}
      <div className="space-y-3">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between border rounded-lg px-4 py-3 hover:shadow-md transition"
          >
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {b.title}
            </a>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
