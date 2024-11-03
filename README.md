# StudyNotion Online Education Platform (MERN App)

## Project Description

StudyNotion is a MERN stack-based ed-tech platform for creating, consuming, and rating educational content. It aims to enhance the learning experience for students and provide instructors with a platform to connect with learners globally.

### Key Features

#### For Students:
- Homepage
- Course List
- Wishlist
- Cart Checkout
- Course Content
- User Details
- User Edit

#### For Instructors:
- Dashboard
- Insights
- Course Management
- Profile Management

#### Future Admin Features:
- Dashboard
- Insights
- Instructor Management

## Architecture Overview

### Components:
- **Front-end**: Built with ReactJS, utilizing Tailwind CSS for responsive design.
- **Back-end**: Node.js and Express.js handle APIs for user authentication, course management, and payment integration.
- **Database**: MongoDB for flexible data storage.

![Architecture](images/architecture.png)

## API Design

The RESTful API supports various functionalities:
- **Authentication**: Sign up, login, OTP verification.
- **Courses**: CRUD operations for courses.

### Sample Endpoints:
- **POST** `/api/auth/signup`: Create a user account.
- **GET** `/api/courses`: Retrieve all courses.
- **POST** `/api/courses`: Create a new course.
- **PUT** `/api/courses/:id`: Update a course.
- **DELETE** `/api/courses/:id`: Remove a course.

## Conclusion

StudyNotion is designed for scalability and usability, ensuring a seamless experience for students and instructors while maintaining security and reliability through its well-structured architecture and API design.
