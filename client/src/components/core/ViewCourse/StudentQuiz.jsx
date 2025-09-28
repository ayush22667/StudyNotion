import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiconnector";
import { quizEndpoints } from "../../../services/apis";

function StudentQuiz() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [result, setResult] = useState(null);

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

  const startQuiz = async (quizId) => {
    try {
      const response = await apiConnector(
        "GET",
        `${quizEndpoints.GET_QUIZ_DETAILS}/${quizId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setQuizDetails(response.data.data);
        setSelectedQuiz(quizId);
        setQuizStarted(true);
        setTimeLeft(response.data.data.timeLimit * 60); // Convert minutes to seconds
        setAnswers(new Array(response.data.data.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Failed to start quiz");
    }
  };

  const submitQuiz = async () => {
    try {
      const timeSpent = (quizDetails.timeLimit * 60 - timeLeft) / 60; // Convert to minutes
      
      const response = await apiConnector(
        "POST",
        quizEndpoints.SUBMIT_QUIZ_ATTEMPT,
        {
          quizId: selectedQuiz,
          answers: answers.map((answer, index) => ({
            questionIndex: index,
            selectedAnswer: answer,
          })),
          timeSpent,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
        setQuizSubmitted(true);
        toast.success("Quiz submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  useEffect(() => {
    if (courseId) {
      fetchQuizzes();
    }
  }, [courseId]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizSubmitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }

  if (quizStarted && quizDetails) {
    return (
      <div className="text-white">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{quizDetails.title}</h2>
          <div className="text-lg font-semibold text-yellow-400">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {!quizSubmitted ? (
          <div className="space-y-6">
            {quizDetails.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-richblack-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Question {questionIndex + 1}: {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-richblack-600 p-3 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question_${questionIndex}`}
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                        className="w-4 h-4 text-yellow-500"
                      />
                      <span className="text-richblack-200">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                onClick={() => setQuizStarted(false)}
                className="px-6 py-2 bg-richblack-600 text-white rounded-lg hover:bg-richblack-500 transition-colors"
              >
                Exit Quiz
              </button>
              <button
                onClick={submitQuiz}
                className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-richblack-700 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Quiz Results</h3>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-yellow-400">
                {result.score}%
              </div>
              <div className={`text-xl font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                {result.passed ? 'Passed!' : 'Failed'}
              </div>
              <div className="text-richblack-300">
                You got {result.correctAnswers} out of {result.totalQuestions} questions correct
              </div>
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setQuizSubmitted(false);
                  setResult(null);
                }}
                className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Course Quizzes</h1>
      
      {quizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-richblack-300 text-lg">No quizzes available for this course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-richblack-700 rounded-lg p-6 hover:bg-richblack-600 transition-colors">
              <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              <p className="text-richblack-300 mb-4 line-clamp-2">{quiz.description}</p>
              
              <div className="space-y-2 text-sm text-richblack-400 mb-4">
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
              </div>

              <button
                onClick={() => startQuiz(quiz._id)}
                className="w-full px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentQuiz;

