const Notes = require("../models/Notes");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Upload notes file
exports.uploadNotes = async (req, res) => {
  try {
    const { title, description, courseId } = req.body;
    const instructorId = req.user.id;
    const file = req.files.notesFile;

    // Validate required fields
    if (!title || !description || !courseId || !file) {
      return res.status(400).json({
        success: false,
        message: "Title, description, course ID, and file are required",
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
        message: "You don't have permission to upload notes for this course",
      });
    }

    // Upload file to Cloudinary
    const uploadedFile = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);

    // Create notes record
    const notes = await Notes.create({
      title,
      description,
      course: courseId,
      instructor: instructorId,
      fileUrl: uploadedFile.secure_url,
      fileName: file.name,
      fileType: file.mimetype,
      fileSize: file.size,
    });

    res.status(201).json({
      success: true,
      message: "Notes uploaded successfully",
      data: notes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload notes",
      error: error.message,
    });
  }
};

// Get all notes for a course
exports.getCourseNotes = async (req, res) => {
  try {
    const { courseId } = req.params;

    const notes = await Notes.find({ course: courseId, isActive: true })
      .populate("instructor", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

// Get notes details (for students - view only)
exports.getNotesDetails = async (req, res) => {
  try {
    const { notesId } = req.params;
    const userId = req.user.id;

    const notes = await Notes.findById(notesId).populate("course", "courseName");
    if (!notes) {
      return res.status(404).json({
        success: false,
        message: "Notes not found",
      });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(notes.course);
    if (!course.studentsEnroled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Return notes details (view only, no download)
    const notesForStudent = {
      _id: notes._id,
      title: notes.title,
      description: notes.description,
      fileName: notes.fileName,
      fileType: notes.fileType,
      fileSize: notes.fileSize,
      createdAt: notes.createdAt,
      // Don't include fileUrl for security
    };

    res.status(200).json({
      success: true,
      data: notesForStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes details",
      error: error.message,
    });
  }
};

// Get notes file for viewing (stream, no download)
exports.getNotesFile = async (req, res) => {
  try {
    const { notesId } = req.params;
    const userId = req.user.id;

    const notes = await Notes.findById(notesId);
    if (!notes) {
      return res.status(404).json({
        success: false,
        message: "Notes not found",
      });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(notes.course);
    if (!course.studentsEnroled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Set headers to prevent download
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Type', notes.fileType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Redirect to the file URL for viewing
    res.redirect(notes.fileUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes file",
      error: error.message,
    });
  }
};

// Update notes
exports.updateNotes = async (req, res) => {
  try {
    const { notesId } = req.params;
    const updates = req.body;
    const instructorId = req.user.id;

    const notes = await Notes.findById(notesId);
    if (!notes) {
      return res.status(404).json({
        success: false,
        message: "Notes not found",
      });
    }

    if (notes.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this notes",
      });
    }

    // Handle file update if new file is provided
    if (req.files && req.files.notesFile) {
      const file = req.files.notesFile;
      const uploadedFile = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
      updates.fileUrl = uploadedFile.secure_url;
      updates.fileName = file.name;
      updates.fileType = file.mimetype;
      updates.fileSize = file.size;
    }

    const updatedNotes = await Notes.findByIdAndUpdate(notesId, updates, { new: true });
    
    res.status(200).json({
      success: true,
      message: "Notes updated successfully",
      data: updatedNotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update notes",
      error: error.message,
    });
  }
};

// Delete notes
exports.deleteNotes = async (req, res) => {
  try {
    const { notesId } = req.params;
    const instructorId = req.user.id;

    const notes = await Notes.findById(notesId);
    if (!notes) {
      return res.status(404).json({
        success: false,
        message: "Notes not found",
      });
    }

    if (notes.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this notes",
      });
    }

    // Soft delete by setting isActive to false
    await Notes.findByIdAndUpdate(notesId, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Notes deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notes",
      error: error.message,
    });
  }
};

