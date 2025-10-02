const express = require("express");
const router = express.Router();

// Import Quiz Controllers
const {
  createQuiz,
  getCourseQuizzes,
  getQuizDetails,
  submitQuizAttempt,
  getQuizResults,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/Quiz");

// Import Middlewares
const { auth, isInstructor, isStudent } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Quiz routes
// ********************************************************************************************************

// Create Quiz (Instructor only)
router.post("/create", auth, isInstructor, createQuiz);

// Get all quizzes for a course
router.get("/course/:courseId", getCourseQuizzes);

// Get quiz details (for students)
router.get("/:quizId", auth, isStudent, getQuizDetails);

// Submit quiz attempt (Student only)
router.post("/submit", auth, isStudent, submitQuizAttempt);

// Get quiz results (Instructor only)
router.get("/results/:quizId", auth, isInstructor, getQuizResults);

// Update quiz (Instructor only)
router.put("/:quizId", auth, isInstructor, updateQuiz);

// Delete quiz (Instructor only)
router.delete("/:quizId", auth, isInstructor, deleteQuiz);

module.exports = router;

