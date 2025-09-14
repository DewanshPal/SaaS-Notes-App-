// getting notes array from the backend and displaying it in a table format
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Note {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    tenantId: string;
}

export default function ViewAllNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/notes");
            if (response.data.success) {
                setNotes(response.data.notes);
            } else {
                toast.error("Failed to fetch notes");
            }
        } catch  {
            toast.error("An error occurred while fetching notes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">All Notes</h2>
            {loading ? (
                <p>Loading notes...</p>
            ) : notes.length === 0 ? (
                <p>No notes available.</p>
            ) : (
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Title</th>
                            <th className="border px-4 py-2">Content</th>
                            <th className="border px-4 py-2">Created At</th>
                            <th className="border px-4 py-2">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note) => (
                            <tr key={note._id}>
                                <td className="border px-4 py-2">{note.title}</td>
                                <td className="border px-4 py-2">{note.content}</td>
                                <td className="border px-4 py-2">{new Date(note.createdAt).toLocaleString()}</td>
                                <td className="border px-4 py-2">{new Date(note.updatedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}