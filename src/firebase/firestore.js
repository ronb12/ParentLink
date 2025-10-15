import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Messages
export const sendMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      timestamp: serverTimestamp(),
      read: false
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getMessages = (senderId, receiverId, callback) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('senderId', 'in', [senderId, receiverId]),
    where('receiverId', 'in', [senderId, receiverId]),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, callback);
};

export const markMessageAsRead = async (messageId) => {
  try {
    await updateDoc(doc(db, 'messages', messageId), {
      read: true
    });
  } catch (error) {
    throw error;
  }
};

// Students
export const createStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getStudents = async (teacherId) => {
  try {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('teacherId', '==', teacherId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const getStudentByParent = async (parentId) => {
  try {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('parentId', '==', parentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Progress Reports
export const createProgressReport = async (progressData) => {
  try {
    const docRef = await addDoc(collection(db, 'progress'), {
      ...progressData,
      date: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getProgressReports = async (studentId) => {
  try {
    const progressRef = collection(db, 'progress');
    const q = query(
      progressRef, 
      where('studentId', '==', studentId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Announcements
export const createAnnouncement = async (announcementData) => {
  try {
    const docRef = await addDoc(collection(db, 'announcements'), {
      ...announcementData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getAnnouncements = (callback) => {
  const announcementsRef = collection(db, 'announcements');
  const q = query(announcementsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, callback);
};

// Events
export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getEvents = (callback) => {
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, orderBy('date', 'asc'));
  return onSnapshot(q, callback);
};

// Files
export const createFileRecord = async (fileData) => {
  try {
    const docRef = await addDoc(collection(db, 'files'), {
      ...fileData,
      uploadedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getFiles = async (sharedWith) => {
  try {
    const filesRef = collection(db, 'files');
    const q = query(filesRef, where('sharedWith', 'array-contains', sharedWith));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};
