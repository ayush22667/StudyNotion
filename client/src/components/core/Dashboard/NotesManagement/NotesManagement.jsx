import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiconnector";
import { notesEndpoints } from "../../../../services/apis";
import UploadNotesModal from "./UploadNotesModal";
import NotesCard from "./NotesCard";

function NotesManagement() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        `${notesEndpoints.GET_COURSE_NOTES}/${courseId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  const handleNotesUploaded = () => {
    setShowUploadModal(false);
    fetchNotes();
  };

  const handleNotesDeleted = () => {
    fetchNotes();
  };

  return (
    <div className="text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notes Management</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="rounded-lg bg-yellow-50 px-6 py-3 text-lg font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
        >
          Upload Notes
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="spinner"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-richblack-300 text-lg">No notes found for this course.</p>
          <p className="text-richblack-400">Upload your first notes to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NotesCard
              key={note._id}
              note={note}
              onDelete={handleNotesDeleted}
            />
          ))}
        </div>
      )}

      {showUploadModal && (
        <UploadNotesModal
          courseId={courseId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleNotesUploaded}
        />
      )}
    </div>
  );
}

export default NotesManagement;

