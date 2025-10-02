const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3, // Assuming 4 options (0-3)
      },
      explanation: {
        type: String,
        default: "",
      },
    },
  ],
  timeLimit: {
    type: Number, // in minutes
    default: 30,
  },
  passingScore: {
    type: Number, // percentage
    default: 70,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
quizSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Quiz", quizSchema);
