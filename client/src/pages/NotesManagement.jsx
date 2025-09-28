import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../services/apiconnector";
import { courseEndpoints } from "../services/apis";
import NotesManagement from "../components/core/Dashboard/NotesManagement/NotesManagement";

function NotesManagementPage() {
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInstructorCourses = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        courseEndpoints.COURSE_INSTRUCTOR_DETAILS,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-6">Notes Management</h1>
        <p className="text-richblack-300 mb-6">Select a course to manage notes:</p>
        
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-richblack-300 text-lg">No courses found.</p>
            <p className="text-richblack-400">Create a course first to manage notes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                className="bg-richblack-700 rounded-lg p-6 hover:bg-richblack-600 transition-colors cursor-pointer"
              >
                <div className="mb-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-richblack-300 line-clamp-2">
                    {course.courseDescription}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm text-richblack-400">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-semibold ${
                      course.status === 'Published' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="text-white">{course.studentsEnroled?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="text-white">₹{course.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => setSelectedCourse(null)}
          className="px-4 py-2 bg-richblack-600 text-white rounded-lg hover:bg-richblack-500 transition-colors"
        >
          ← Back to Courses
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Notes Management</h1>
          <p className="text-richblack-300">Course: {selectedCourse.courseName}</p>
        </div>
      </div>
      
      <NotesManagement courseId={selectedCourse._id} />
    </div>
  );
}

export default NotesManagementPage;



