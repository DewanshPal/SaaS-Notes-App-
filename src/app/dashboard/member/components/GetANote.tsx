"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function GetANote({ noteId }: { noteId: string }) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNote = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/notes/${noteId}`);
      if (response.data.success) {
        setNote(response.data.note);
        setMessage("Note fetched successfully!");
      } else {
        setMessage("Failed to fetch note");
      }
    } catch {
      setMessage("An error occurred while fetching the note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  });

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-xl font-semibold mb-4">Get A Note</h2>
      {loading ? (
        <p>Loading note...</p>
      ) : note ? (
        <div>
          <h3 className="text-lg font-bold">{note.title}</h3>
          <p className="mt-2">{note.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            Created At: {new Date(note.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Updated At: {new Date(note.updatedAt).toLocaleString()}
          </p>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      ) : (
        <p>No note found</p>
      )}
    </div>
  );
}