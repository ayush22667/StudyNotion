// API endpoints for the application

// Authentication endpoints
export const authEndpoints = {
  SENDOTP: "/api/v1/auth/sendotp",
  SIGNUP: "/api/v1/auth/signup",
  LOGIN: "/api/v1/auth/login",
  RESETPASSTOKEN: "/api/v1/auth/reset-password-token",
  RESETPASSWORD: "/api/v1/auth/reset-password",
  VERIFY_EMAIL: "/api/v1/auth/verify-email",
};

// Profile endpoints
export const profileEndpoints = {
  GET_USER_DETAILS: "/api/v1/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES: "/api/v1/profile/getEnrolledCourses",
  UPDATE_DISPLAY_PICTURE: "/api/v1/profile/updateDisplayPicture",
  UPDATE_PROFILE: "/api/v1/profile/updateProfile",
  DELETE_PROFILE: "/api/v1/profile/deleteProfile",
  CHANGE_PASSWORD: "/api/v1/profile/changePassword",
};

// Course endpoints
export const courseEndpoints = {
  GET_ALL_COURSES: "/api/v1/course/getAllCourses",
  COURSE_DETAILS: "/api/v1/course/getCourseDetails",
  COURSE_CATEGORIES: "/api/v1/course/showAllCategories",
  EDIT_COURSE: "/api/v1/course/editCourse",
  COURSE_INSTRUCTOR_DETAILS: "/api/v1/course/getInstructorCourses",
  CREATE_COURSE: "/api/v1/course/createCourse",
  CREATE_SECTION: "/api/v1/course/addSection",
  CREATE_SUBSECTION: "/api/v1/course/addSubSection",
  UPDATE_SECTION: "/api/v1/course/updateSection",
  UPDATE_SUBSECTION: "/api/v1/course/updateSubSection",
  DELETE_SECTION: "/api/v1/course/deleteSection",
  DELETE_SUBSECTION: "/api/v1/course/deleteSubSection",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: "/api/v1/course/getFullCourseDetails",
  CREATE_RATING: "/api/v1/course/createRating",
  LECTURE_COMPLETION: "/api/v1/course/updateCourseProgress",
  CREATE_CATEGORY: "/api/v1/course/createCategory",
  GET_CATEGORY_PAGE_DETAILS: "/api/v1/course/getCategoryPageDetails",
};

// Payment endpoints
export const paymentEndpoints = {
  COURSE_PAYMENT_VERIFICATION: "/api/v1/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL: "/api/v1/payment/sendPaymentSuccessEmail",
};

// Contact endpoints
export const contactEndpoints = {
  CONTACT_US: "/api/v1/reach/contact",
};

// Quiz endpoints
export const quizEndpoints = {
  CREATE_QUIZ: "/api/v1/quiz/create",
  GET_COURSE_QUIZZES: "/api/v1/quiz/course",
  GET_QUIZ_DETAILS: "/api/v1/quiz",
  SUBMIT_QUIZ_ATTEMPT: "/api/v1/quiz/submit",
  GET_QUIZ_RESULTS: "/api/v1/quiz/results",
  UPDATE_QUIZ: "/api/v1/quiz",
  DELETE_QUIZ: "/api/v1/quiz",
};

// Notes endpoints
export const notesEndpoints = {
  UPLOAD_NOTES: "/api/v1/notes/upload",
  GET_COURSE_NOTES: "/api/v1/notes/course",
  GET_NOTES_DETAILS: "/api/v1/notes",
  GET_NOTES_FILE: "/api/v1/notes/file",
  UPDATE_NOTES: "/api/v1/notes",
  DELETE_NOTES: "/api/v1/notes",
};