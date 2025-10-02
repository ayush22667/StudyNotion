import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { notesEndpoints } from "../../../services/apis";

function StudentNotes() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

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

  const viewNote = async (noteId) => {
    try {
      const response = await apiConnector(
        "GET",
        `${notesEndpoints.GET_NOTES_DETAILS}/${noteId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setSelectedNote(response.data.data);
        setViewerOpen(true);
      }
    } catch (error) {
      console.error("Error fetching note details:", error);
      toast.error("Failed to load note details");
    }
  };

  const openNoteFile = (noteId) => {
    // Open the note file in a new tab for viewing (no download)
    const fileUrl = `${notesEndpoints.GET_NOTES_FILE}/${noteId}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) {
      return "📄";
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return "📝";
    } else if (fileType.includes("powerpoint") || fileType.includes("presentation")) {
      return "📊";
    } else {
      return "📁";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Course Notes</h1>
      
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-richblack-300 text-lg">No notes available for this course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="bg-richblack-700 rounded-lg p-6 hover:bg-richblack-600 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{getFileIcon(note.fileType)}</span>
                <div>
                  <h3 className="text-xl font-semibold">{note.title}</h3>
                  <p className="text-sm text-richblack-300">{note.fileName}</p>
                </div>
              </div>
              
              <p className="text-richblack-300 mb-4 line-clamp-2">{note.description}</p>
              
              <div className="space-y-2 text-sm text-richblack-400 mb-4">
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="text-white">{formatFileSize(note.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>File Type:</span>
                  <span className="text-white">{note.fileType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span className="text-white">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => viewNote(note._id)}
                  className="flex-1 px-4 py-2 bg-richblack-600 text-white rounded-lg hover:bg-richblack-500 transition-colors text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => openNoteFile(note._id)}
                  className="flex-1 px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors text-center"
                >
                  Open File
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Details Modal */}
      {viewerOpen && selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-richblack-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Note Details</h2>
              <button
                onClick={() => setViewerOpen(false)}
                className="text-richblack-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{selectedNote.title}</h3>
                <p className="text-richblack-300">{selectedNote.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-richblack-400">File Name:</span>
                  <p className="text-white">{selectedNote.fileName}</p>
                </div>
                <div>
                  <span className="text-richblack-400">File Size:</span>
                  <p className="text-white">{formatFileSize(selectedNote.fileSize)}</p>
                </div>
                <div>
                  <span className="text-richblack-400">File Type:</span>
                  <p className="text-white">{selectedNote.fileType}</p>
                </div>
                <div>
                  <span className="text-richblack-400">Uploaded:</span>
                  <p className="text-white">
                    {new Date(selectedNote.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setViewerOpen(false)}
                  className="px-6 py-2 bg-richblack-600 text-white rounded-lg hover:bg-richblack-500 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => openNoteFile(selectedNote._id)}
                  className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  Open File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentNotes;




