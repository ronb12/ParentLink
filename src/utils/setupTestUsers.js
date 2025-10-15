import { createUser } from '../firebase/auth';
import { createStudent } from '../firebase/firestore';

export const setupTestUsers = async () => {
  try {
    console.log('Setting up test users...');

    // Create test parent
    const parentUser = await createUser('parent@test.com', 'password123', {
      name: 'John Smith',
      role: 'parent',
      phone: '(555) 123-4567',
      school: 'Lincoln Elementary School',
      grade: '3rd Grade'
    });

    console.log('Test parent created:', parentUser.uid);

    // Create test teacher
    const teacherUser = await createUser('teacher@test.com', 'password123', {
      name: 'Sarah Johnson',
      role: 'teacher',
      phone: '(555) 987-6543',
      school: 'Lincoln Elementary School',
      subjects: ['Mathematics', 'English', 'Science']
    });

    console.log('Test teacher created:', teacherUser.uid);

    // Create test student
    const studentData = await createStudent({
      name: 'Emma Smith',
      email: 'emma@student.com',
      phone: '(555) 111-2222',
      grade: '3rd Grade',
      parentName: 'John Smith',
      parentEmail: 'parent@test.com',
      parentPhone: '(555) 123-4567',
      parentId: parentUser.uid,
      teacherId: teacherUser.uid,
      teacherName: 'Sarah Johnson'
    });

    console.log('Test student created:', studentData);

    // Create additional test students
    const student2Data = await createStudent({
      name: 'Michael Johnson',
      email: 'michael@student.com',
      phone: '(555) 333-4444',
      grade: '3rd Grade',
      parentName: 'Jane Johnson',
      parentEmail: 'jane@test.com',
      parentPhone: '(555) 555-6666',
      parentId: '', // Will be set when parent registers
      teacherId: teacherUser.uid,
      teacherName: 'Sarah Johnson'
    });

    console.log('Test student 2 created:', student2Data);

    console.log('Test users setup completed successfully!');
    console.log('Test accounts:');
    console.log('Parent: parent@test.com / password123');
    console.log('Teacher: teacher@test.com / password123');
    
    return {
      parent: parentUser,
      teacher: teacherUser,
      students: [studentData, student2Data]
    };
  } catch (error) {
    console.error('Error setting up test users:', error);
    throw error;
  }
};

// Function to create sample data
export const createSampleData = async (teacherId, parentId, studentId) => {
  try {
    console.log('Creating sample data...');

    // Create sample announcements
    const { createAnnouncement } = await import('../firebase/firestore');
    
    await createAnnouncement({
      title: 'Welcome to the New School Year!',
      content: 'We are excited to welcome all students and parents to the new school year. Please make sure to review the school calendar and upcoming events.',
      priority: 'high',
      authorId: teacherId,
      authorName: 'Sarah Johnson'
    });

    await createAnnouncement({
      title: 'Parent-Teacher Conference Sign-up',
      content: 'Parent-teacher conferences are scheduled for next week. Please use the calendar to sign up for your preferred time slot.',
      priority: 'medium',
      authorId: teacherId,
      authorName: 'Sarah Johnson'
    });

    // Create sample events
    const { createEvent } = await import('../firebase/firestore');
    
    await createEvent({
      title: 'Math Test - Chapter 3',
      description: 'Students will be tested on multiplication and division concepts covered in Chapter 3.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      location: 'Classroom 3A',
      type: 'exam',
      createdBy: teacherId,
      createdByName: 'Sarah Johnson'
    });

    await createEvent({
      title: 'Science Fair',
      description: 'Annual science fair showcasing student projects and experiments.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      location: 'School Gymnasium',
      type: 'general',
      createdBy: teacherId,
      createdByName: 'Sarah Johnson'
    });

    // Create sample progress reports
    const { createProgressReport } = await import('../firebase/firestore');
    
    await createProgressReport({
      studentId: studentId,
      studentName: 'Emma Smith',
      teacherId: teacherId,
      teacherName: 'Sarah Johnson',
      parentId: parentId,
      subject: 'Mathematics',
      grade: 'A+',
      comments: 'Emma shows excellent understanding of multiplication concepts. She consistently completes her homework and participates actively in class discussions.',
      behavior: 'excellent',
      attendance: 'present'
    });

    await createProgressReport({
      studentId: studentId,
      studentName: 'Emma Smith',
      teacherId: teacherId,
      teacherName: 'Sarah Johnson',
      parentId: parentId,
      subject: 'English',
      grade: 'A',
      comments: 'Emma is a strong reader and writer. She could benefit from more practice with creative writing exercises.',
      behavior: 'good',
      attendance: 'present'
    });

    console.log('Sample data created successfully!');
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};
