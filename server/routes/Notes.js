const express = require("express");
const router = express.Router();

// Import Notes Controllers
const {
  uploadNotes,
  getCourseNotes,
  getNotesDetails,
  getNotesFile,
  updateNotes,
  deleteNotes,
} = require("../controllers/Notes");

// Import Middlewares
const { auth, isInstructor, isStudent } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Notes routes
// ********************************************************************************************************

// Upload Notes (Instructor only)
router.post("/upload", auth, isInstructor, uploadNotes);

// Get all notes for a course
router.get("/course/:courseId", getCourseNotes);

// Get notes details (for students)
router.get("/:notesId", auth, isStudent, getNotesDetails);

// Get notes file for viewing (Student only, no download)
router.get("/file/:notesId", auth, isStudent, getNotesFile);

// Update notes (Instructor only)
router.put("/:notesId", auth, isInstructor, updateNotes);

// Delete notes (Instructor only)
router.delete("/:notesId", auth, isInstructor, deleteNotes);

module.exports = router;

