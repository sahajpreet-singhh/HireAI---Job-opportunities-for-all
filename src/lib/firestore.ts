import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Job, UserProfile, Application } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profiles
export const createUserProfile = async (uid: string, data: Omit<UserProfile, 'uid' | 'createdAt'>) => {
  const path = `users/${uid}`;
  try {
    const profile: Omit<UserProfile, 'uid'> = {
      ...data,
      createdAt: serverTimestamp()
    };
    await setDoc(doc(db, 'users', uid), profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserProfile = async (uid: string) => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

// Jobs
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'postedAt'>) => {
  const path = 'jobs';
  try {
    const docRef = await addDoc(collection(db, 'jobs'), {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getJobs = async (filterCategory?: string) => {
  const path = 'jobs';
  try {
    let q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    if (filterCategory && filterCategory !== 'All') {
      q = query(collection(db, 'jobs'), where('category', '==', filterCategory), orderBy('createdAt', 'desc'));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const getEmployerJobs = async (employerId: string) => {
  const path = 'jobs';
  try {
    const q = query(collection(db, 'jobs'), where('ownerId', '==', employerId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

// Applications
export const applyForJob = async (applicationData: Omit<Application, 'id' | 'appliedAt' | 'status'>) => {
  const path = 'applications';
  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...applicationData,
      status: 'pending',
      appliedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getSeekerApplications = async (seekerId: string) => {
  const path = 'applications';
  try {
    const q = query(collection(db, 'applications'), where('seekerId', '==', seekerId), orderBy('appliedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const getEmployerApplications = async (employerId: string) => {
  const path = 'applications';
  try {
    const q = query(collection(db, 'applications'), where('employerId', '==', employerId), orderBy('appliedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
  const path = `applications/${applicationId}`;
  try {
    const docRef = doc(db, 'applications', applicationId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};
