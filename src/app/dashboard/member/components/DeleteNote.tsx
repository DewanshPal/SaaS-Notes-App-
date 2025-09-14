//delete the note with the given id
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface DeleteNoteProps {
  noteId: string;
}

export default function DeleteNote({ noteId }: DeleteNoteProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!noteId) {
      toast.error("Please enter a valid note ID");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`/api/notes/${noteId}`);
      if (response.data.success) {
        toast.success("Note deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete note");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the note");
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
    </div>
  );
}
