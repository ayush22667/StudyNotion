const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Course = require("../models/Course");
const User = require("../models/User");

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, courseId, questions, timeLimit, passingScore } = req.body;
    const instructorId = req.user.id;

    // Validate required fields
    if (!title || !description || !courseId || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, description, course ID, and questions are required",
      });
    }

    // Check if course exists and belongs to instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to create quiz for this course",
      });
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question || !question.options || question.options.length !== 4 || 
          typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
        return res.status(400).json({
          success: false,
          message: `Invalid question format at index ${i}`,
        });
      }
    }

    // Create quiz
    const quiz = await Quiz.create({
      title,
      description,
      course: courseId,
      instructor: instructorId,
      questions,
      timeLimit: timeLimit || 30,
      passingScore: passingScore || 70,
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};

// Get all quizzes for a course
exports.getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quizzes = await Quiz.find({ course: courseId, isActive: true })
      .populate("instructor", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};

// Get quiz details (for students - without correct answers)
exports.getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId).populate("course", "courseName");
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(quiz.course);
    if (!course.studentsEnroled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Return quiz without correct answers
    const quizForStudent = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        // Don't include correctAnswer or explanation
      })),
      createdAt: quiz.createdAt,
    };

    res.status(200).json({
      success: true,
      data: quizForStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz details",
      error: error.message,
    });
  }
};

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(quiz.course);
    if (!course.studentsEnroled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const quizAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save quiz attempt
    const quizAttempt = await QuizAttempt.create({
      student: userId,
      quiz: quizId,
      course: quiz.course,
      answers: quizAnswers,
      score,
      passed,
      timeSpent,
    });

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        score,
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        attemptId: quizAttempt._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
};

// Get quiz results (for instructor)
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const instructorId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this quiz results",
      });
    }

    const attempts = await QuizAttempt.find({ quiz: quizId })
      .populate("student", "firstName lastName email")
      .sort({ attemptedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          title: quiz.title,
          description: quiz.description,
          passingScore: quiz.passingScore,
        },
        attempts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz results",
      error: error.message,
    });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const updates = req.body;
    const instructorId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this quiz",
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updates, { new: true });
    
    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update quiz",
      error: error.message,
    });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const instructorId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this quiz",
      });
    }

    // Soft delete by setting isActive to false
    await Quiz.findByIdAndUpdate(quizId, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
      error: error.message,
    });
  }
};

