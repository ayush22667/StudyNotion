import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiconnector";
import { quizEndpoints } from "../../../../services/apis";
import CreateQuizModal from "./CreateQuizModal";
import QuizCard from "./QuizCard";

function QuizManagement() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        `${quizEndpoints.GET_COURSE_QUIZZES}/${courseId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setQuizzes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchQuizzes();
    }
  }, [courseId]);

  const handleQuizCreated = () => {
    setShowCreateModal(false);
    fetchQuizzes();
  };

  const handleQuizDeleted = () => {
    fetchQuizzes();
  };

  return (
    <div className="text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quiz Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-yellow-50 px-6 py-3 text-lg font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
        >
          Create New Quiz
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="spinner"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-richblack-300 text-lg">No quizzes found for this course.</p>
          <p className="text-richblack-400">Create your first quiz to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={handleQuizDeleted}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateQuizModal
          courseId={courseId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleQuizCreated}
        />
      )}
    </div>
  );
}

export default QuizManagement;
