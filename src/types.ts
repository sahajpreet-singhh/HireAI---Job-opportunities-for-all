export interface Job {
  id: string;
  ownerId?: string; // UID of the employer
  title: string;
  companyId: string; // Can be ownerId or a separate ID if we had a companies collection
  companyName?: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  description: string;
  postedAt: string; // Keep for display
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  category: string;
  aiMatchScore: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'seeker' | 'employer';
  createdAt: any;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  employerId: string;
  jobTitle: string;
  companyName: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: any;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  employees: string;
  headquarters: string;
  website: string;
  milestones: { year: string; event: string }[];
}

export interface SuccessMetric {
  label: string;
  value: string;
  suffix: string;
}

export interface TalentHighlight {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}
