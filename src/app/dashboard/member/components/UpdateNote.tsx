"use client";
import { useState } from "react";
import axios from "axios";

interface UpdateNoteProps {
  noteId: string;
}

export default function UpdateNote({ noteId }: UpdateNoteProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    if (!noteId) {
      setMessage("Please enter a valid note ID");
      return;
    }
    if (!title || !content) {
      setMessage("Please enter both title and content");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`/api/notes/${noteId}`, { title, content });
      if (response.data.success) {
        setMessage("Note updated successfully");
      } else {
        setMessage(response.data.message || "Failed to update note");
      }
    } catch (error) {
      setMessage("An error occurred while updating the note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <input
        type="text"
        placeholder="New Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <textarea
        placeholder="New Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handleUpdate}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Note"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}