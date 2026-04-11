export type Gender = 'male' | 'female' | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  gender: Gender;
  age?: number;
  job?: string;
  photo?: string; // Base64 or URL
  notes?: string;
  x: number;
  y: number;
}

export interface Relationship {
  sourceId: string;
  targetId: string;
  type: 'parent-child' | 'spouse' | 'sibling';
}

export interface PEIData {
  studentName: string;
  birthDate: string;
  originCountry: string;
  languagesSpoken: string[];
  familyMembers: FamilyMember[];
  relationships: Relationship[];
  schoolHistory: string;
  strengths: string;
  needs: string;
}
