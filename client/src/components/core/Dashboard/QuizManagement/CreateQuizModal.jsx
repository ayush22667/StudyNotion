import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiconnector";
import { quizEndpoints } from "../../../../services/apis";

function CreateQuizModal({ courseId, onClose, onSuccess }) {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    passingScore: 70,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, optIndex) =>
                optIndex === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== questionIndex),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error("Title and description are required");
        return;
      }

      for (let i = 0; i < formData.questions.length; i++) {
        const question = formData.questions[i];
        if (!question.question.trim()) {
          toast.error(`Question ${i + 1} is required`);
          return;
        }
        if (question.options.some((opt) => !opt.trim())) {
          toast.error(`All options for question ${i + 1} are required`);
          return;
        }
      }

      const response = await apiConnector(
        "POST",
        quizEndpoints.CREATE_QUIZ,
        {
          title: formData.title,
          description: formData.description,
          courseId,
          timeLimit: parseInt(formData.timeLimit),
          passingScore: parseInt(formData.passingScore),
          questions: formData.questions,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        toast.success("Quiz created successfully!");
        onSuccess();
      } else {
        toast.error(response.data.message || "Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-richblack-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Quiz</h2>
          <button
            onClick={onClose}
            className="text-richblack-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-richblack-200 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-richblack-200 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Passing Score (%)
            </label>
            <input
              type="number"
              name="passingScore"
              value={formData.passingScore}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                Add Question
              </button>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-6 p-4 bg-richblack-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium">Question {questionIndex + 1}</h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-richblack-200 mb-2">
                      Question *
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, "question", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-richblack-600 border border-richblack-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-richblack-200 mb-2">
                      Options *
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={`correctAnswer_${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() =>
                            handleQuestionChange(questionIndex, "correctAnswer", optionIndex)
                          }
                          className="mr-3"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(questionIndex, optionIndex, e.target.value)
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 px-3 py-2 bg-richblack-600 border border-richblack-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-richblack-200 mb-2">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, "explanation", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-richblack-600 border border-richblack-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-richblack-600 text-white rounded-lg hover:bg-richblack-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuizModal;

