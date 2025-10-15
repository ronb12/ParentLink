import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProgressReports, createProgressReport } from '../firebase/firestore';
import { getStudents, getStudentByParent } from '../firebase/firestore';
import { Plus, TrendingUp, TrendingDown, Minus, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Progress = () => {
  const { user, userData, isParent, isTeacher } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progressReports, setProgressReports] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    comments: '',
    behavior: 'good',
    attendance: 'present'
  });

  useEffect(() => {
    loadStudents();
  }, [userData]);

  useEffect(() => {
    if (selectedStudent) {
      loadProgressReports();
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      let studentsData = [];

      if (isParent) {
        studentsData = await getStudentByParent(user.uid);
      } else if (isTeacher) {
        studentsData = await getStudents(user.uid);
      }

      setStudents(studentsData);
      if (studentsData.length > 0 && !selectedStudent) {
        setSelectedStudent(studentsData[0]);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadProgressReports = async () => {
    if (!selectedStudent) return;

    try {
      const reports = await getProgressReports(selectedStudent.id);
      setProgressReports(reports);
    } catch (error) {
      console.error('Error loading progress reports:', error);
      toast.error('Failed to load progress reports');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      await createProgressReport({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        teacherId: user.uid,
        teacherName: userData.name,
        parentId: selectedStudent.parentId,
        ...formData
      });

      toast.success('Progress report added successfully');
      setShowAddForm(false);
      setFormData({
        subject: '',
        grade: '',
        comments: '',
        behavior: 'good',
        attendance: 'present'
      });
      loadProgressReports();
    } catch (error) {
      console.error('Error creating progress report:', error);
      toast.error('Failed to add progress report');
    }
  };

  const getGradeColor = (grade) => {
    const numGrade = parseFloat(grade);
    if (numGrade >= 90) return 'text-green-600 bg-green-100';
    if (numGrade >= 80) return 'text-blue-600 bg-blue-100';
    if (numGrade >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBehaviorIcon = (behavior) => {
    switch (behavior) {
      case 'excellent':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'good':
        return <Minus className="h-4 w-4 text-blue-600" />;
      case 'needs_improvement':
        return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
        <p className="text-gray-500">
          {isParent 
            ? "Your child hasn't been added to the system yet."
            : "No students have been assigned to your class yet."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Reports</h1>
          <p className="text-gray-600">Track student academic progress and behavior</p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Report</span>
          </button>
        )}
      </div>

      {/* Student Selector */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Select Student</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedStudent?.id === student.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Reports */}
      {selectedStudent && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Progress Reports for {selectedStudent.name}
            </h2>
          </div>
          <div className="space-y-4">
            {progressReports.length > 0 ? (
              progressReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{report.subject}</h3>
                      <p className="text-sm text-gray-500">
                        {report.date && format(report.date.toDate(), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(report.grade)}`}>
                        {report.grade}
                      </span>
                      {getBehaviorIcon(report.behavior)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Grade:</span>
                      <p className="text-sm text-gray-600">{report.grade}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Behavior:</span>
                      <p className="text-sm text-gray-600 capitalize">{report.behavior.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Attendance:</span>
                      <p className="text-sm text-gray-600 capitalize">{report.attendance}</p>
                    </div>
                  </div>
                  {report.comments && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Comments:</span>
                      <p className="text-sm text-gray-600 mt-1">{report.comments}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No progress reports yet</h3>
                <p className="text-gray-500">
                  {isTeacher 
                    ? "Add the first progress report for this student."
                    : "Progress reports will appear here once your child's teacher adds them."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Progress Report Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Progress Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="input-field"
                  placeholder="e.g., A+, 95, Excellent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Behavior
                </label>
                <select
                  value={formData.behavior}
                  onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
                  className="input-field"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="needs_improvement">Needs Improvement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendance
                </label>
                <select
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className="input-field"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Additional comments about the student's progress..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Add Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
