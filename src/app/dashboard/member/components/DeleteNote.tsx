"use client";
import { useState } from "react";
import axios from "axios";


interface DeleteNoteProps {
  noteId: string;
}

export default function DeleteNote({ noteId }: DeleteNoteProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!noteId) {
      setMessage("Please enter a valid note ID");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`/api/notes/${noteId}`);
      if (response.data.success) {
        setMessage("Note deleted successfully");
      } else {
        setMessage(response.data.message || "Failed to delete note");
      }
    } catch {
      setMessage("An error occurred while deleting the note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Note"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
