import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiconnector";
import { quizEndpoints } from "../../../../services/apis";

function QuizCard({ quiz, onDelete }) {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiConnector(
        "DELETE",
        `${quizEndpoints.DELETE_QUIZ}/${quiz._id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        toast.success("Quiz deleted successfully!");
        onDelete();
      } else {
        toast.error(response.data.message || "Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-richblack-700 rounded-lg p-6 hover:bg-richblack-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{quiz.title}</h3>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-richblack-300 mb-4 line-clamp-2">{quiz.description}</p>

      <div className="space-y-2 text-sm text-richblack-400">
        <div className="flex justify-between">
          <span>Questions:</span>
          <span className="text-white">{quiz.questions.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Time Limit:</span>
          <span className="text-white">{quiz.timeLimit} minutes</span>
        </div>
        <div className="flex justify-between">
          <span>Passing Score:</span>
          <span className="text-white">{quiz.passingScore}%</span>
        </div>
        <div className="flex justify-between">
          <span>Created:</span>
          <span className="text-white">
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button className="flex-1 px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors text-center">
          View Results
        </button>
        <button className="flex-1 px-4 py-2 bg-richblack-600 text-white rounded-lg hover:bg-richblack-500 transition-colors text-center">
          Edit Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizCard;

