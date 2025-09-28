# Quiz and Notes Management Features

This document describes the new quiz and notes management features added to the StudyNotion platform.

## Features Overview

### For Instructors (Admins)

#### Quiz Management
- **Create Quizzes**: Instructors can create quizzes for their courses with multiple choice questions
- **Quiz Configuration**: Set time limits, passing scores, and question explanations
- **Question Management**: Add multiple questions with 4 options each and mark correct answers
- **Quiz Results**: View student quiz attempts and results
- **Quiz Editing**: Update or delete existing quizzes

#### Notes Management
- **Upload Notes**: Upload course materials (PDF, DOC, DOCX, TXT, PPT, PPTX)
- **File Security**: Notes are stored securely and students can only view, not download
- **File Management**: Edit or delete uploaded notes
- **File Information**: Track file size, type, and upload date

### For Students

#### Quiz Taking
- **Take Quizzes**: Access quizzes for enrolled courses
- **Timed Quizzes**: Complete quizzes within the specified time limit
- **Instant Results**: Get immediate feedback on quiz performance
- **Progress Tracking**: View quiz scores and pass/fail status

#### Notes Viewing
- **View Notes**: Access course materials uploaded by instructors
- **Secure Viewing**: View files in browser without download capability
- **File Details**: See file information and descriptions
- **Multiple Formats**: Support for various document formats

## Technical Implementation

### Backend (Node.js/Express)

#### Models
- **Quiz**: Stores quiz information, questions, and settings
- **Notes**: Stores file information and metadata
- **QuizAttempt**: Tracks student quiz submissions and results

#### API Endpoints
- Quiz Management: `/api/v1/quiz/*`
- Notes Management: `/api/v1/notes/*`

#### Security Features
- Authentication required for all operations
- Role-based access (Instructor vs Student)
- File upload restrictions and validation
- Secure file serving (view-only for students)

### Frontend (React)

#### Instructor Components
- Quiz Management Dashboard
- Quiz Creation Modal
- Notes Upload Interface
- Course Selection for Management

#### Student Components
- Quiz Taking Interface
- Notes Viewer
- Integrated Course Navigation

#### UI Features
- Responsive design
- Real-time quiz timer
- File type icons and information
- Progress tracking

## Usage Instructions

### For Instructors

1. **Access Quiz Management**:
   - Go to Dashboard → Quiz Management
   - Select a course to manage quizzes

2. **Create a Quiz**:
   - Click "Create New Quiz"
   - Fill in quiz details (title, description, time limit, passing score)
   - Add questions with 4 options each
   - Mark correct answers and add explanations
   - Save the quiz

3. **Upload Notes**:
   - Go to Dashboard → Notes Management
   - Select a course to manage notes
   - Click "Upload Notes"
   - Fill in title and description
   - Select file to upload (max 10MB)
   - Upload the file

### For Students

1. **Take Quizzes**:
   - Go to enrolled course
   - Click on "Quiz" tab in sidebar
   - Select a quiz to take
   - Answer questions within time limit
   - Submit and view results

2. **View Notes**:
   - Go to enrolled course
   - Click on "Notes" tab in sidebar
   - Browse available notes
   - Click "Open File" to view (no download)

## Security Considerations

- Students cannot download notes files
- Quiz answers are not revealed to students
- File uploads are validated for type and size
- All operations require proper authentication
- Role-based permissions enforced

## File Support

### Supported File Types for Notes
- PDF documents
- Microsoft Word (DOC, DOCX)
- Text files (TXT)
- PowerPoint presentations (PPT, PPTX)

### File Size Limits
- Maximum file size: 10MB per upload
- Multiple files can be uploaded per course

## Database Schema

### Quiz Model
```javascript
{
  title: String,
  description: String,
  course: ObjectId (ref: Course),
  instructor: ObjectId (ref: User),
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  timeLimit: Number,
  passingScore: Number,
  isActive: Boolean
}
```

### Notes Model
```javascript
{
  title: String,
  description: String,
  course: ObjectId (ref: Course),
  instructor: ObjectId (ref: User),
  fileUrl: String,
  fileName: String,
  fileType: String,
  fileSize: Number,
  isActive: Boolean
}
```

### QuizAttempt Model
```javascript
{
  student: ObjectId (ref: User),
  quiz: ObjectId (ref: Quiz),
  course: ObjectId (ref: Course),
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  score: Number,
  passed: Boolean,
  timeSpent: Number
}
```

## Future Enhancements

- Quiz analytics and reporting
- Advanced question types (multiple choice, true/false, essay)
- Quiz scheduling and availability windows
- Notes categorization and tagging
- Collaborative note-taking features
- Mobile app support for quiz taking



