export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
  statusText: string;
}

export type ProjectCategory = 
  | 'Penetration Testing'
  | 'Threat Intelligence'
  | 'Reverse Engineering'
  | 'Defensive Security'
  | 'Incident Response'
  | 'Cryptography'
  | 'Other';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: 'Completed' | 'In Progress' | 'Planned';
  tags: string[];
  githubLink?: string;
  reportLink?: string;
  date: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationLink?: string;
  status: 'Active' | 'In Progress' | 'Planned';
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  certifications: Certification[];
}
