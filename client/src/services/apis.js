// API endpoints for the application

// Authentication endpoints
export const authEndpoints = {
  SENDOTP_API: "/auth/sendotp",
  SIGNUP_API: "/auth/signup",
  LOGIN_API: "/auth/login",
  RESETPASSTOKEN_API: "/auth/reset-password-token",
  RESETPASSWORD_API: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
};

// Profile endpoints
export const profileEndpoints = {
  GET_USER_DETAILS_API: "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: "/profile/instructorDashboard",
  UPDATE_DISPLAY_PICTURE_API: "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: "/profile/updateProfile",
  DELETE_PROFILE_API: "/profile/deleteProfile",
  CHANGE_PASSWORD_API: "/profile/changePassword",
};

// Course endpoints
export const courseEndpoints = {
  GET_ALL_COURSES: "/course/getAllCourses",
  COURSE_DETAILS: "/course/getCourseDetails",
  COURSE_CATEGORIES: "/course/showAllCategories",
  EDIT_COURSE: "/course/editCourse",
  COURSE_INSTRUCTOR_DETAILS: "/course/getInstructorCourses",
  CREATE_COURSE: "/course/createCourse",
  CREATE_SECTION: "/course/addSection",
  CREATE_SUBSECTION: "/course/addSubSection",
  UPDATE_SECTION: "/course/updateSection",
  UPDATE_SUBSECTION: "/course/updateSubSection",
  DELETE_SECTION: "/course/deleteSection",
  DELETE_SUBSECTION: "/course/deleteSubSection",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: "/course/getFullCourseDetails",
  CREATE_RATING: "/course/createRating",
  LECTURE_COMPLETION: "/course/updateCourseProgress",
  CREATE_CATEGORY: "/course/createCategory",
  GET_CATEGORY_PAGE_DETAILS: "/course/getCategoryPageDetails",
  CATALOGPAGEDATA_API: "/course/getCategoryPageDetails",
};

// Payment endpoints
export const paymentEndpoints = {
  COURSE_PAYMENT_VERIFICATION: "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL: "/payment/sendPaymentSuccessEmail",
};

// Contact endpoints
export const contactEndpoints = {
  CONTACT_US: "/reach/contact",
};

// Quiz endpoints
export const quizEndpoints = {
  CREATE_QUIZ: "/quiz/create",
  GET_COURSE_QUIZZES: "/quiz/course",
  GET_QUIZ_DETAILS: "/quiz",
  SUBMIT_QUIZ_ATTEMPT: "/quiz/submit",
  GET_QUIZ_RESULTS: "/quiz/results",
  UPDATE_QUIZ: "/quiz",
  DELETE_QUIZ: "/quiz",
};

// Notes endpoints
export const notesEndpoints = {
  UPLOAD_NOTES: "/notes/upload",
  GET_COURSE_NOTES: "/notes/course",
  GET_NOTES_DETAILS: "/notes",
  GET_NOTES_FILE: "/notes/file",
  UPDATE_NOTES: "/notes",
  DELETE_NOTES: "/notes",
};

// Legacy endpoint aliases for backward compatibility
export const endpoints = authEndpoints;
export const categories = courseEndpoints;
export const catalogData = courseEndpoints;
export const contactusEndpoint = contactEndpoints;
export const ratingsEndpoints = courseEndpoints;
export const settingsEndpoints = profileEndpoints;
export const studentEndpoints = {
  COURSE_PAYMENT_API: "/payment/capturePayment",
  COURSE_VERIFY_API: "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: "/payment/sendPaymentSuccessEmail",
};