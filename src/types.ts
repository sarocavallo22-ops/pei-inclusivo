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

export interface SchoolHistory {
  infanzia: string;
  primaria: string;
  media: string;
  superiore: string;
}

export interface SchoolActivity {
  id: string;
  type: 'text' | 'image';
  content: string;
  title?: string;
  date: string;
}

export interface SubjectSection {
  id: string;
  name: string;
  activities: SchoolActivity[];
  color: string;
}

export interface PEIData {
  studentName: string;
  birthDate: string;
  originCountry: string;
  languagesSpoken: string[];
  familyMembers: FamilyMember[];
  relationships: Relationship[];
  schoolHistory: SchoolHistory;
  schoolYears: SchoolHistory;
  freeTime: string;
  strengths: string;
  needs: string;
  communication: string;
  autonomy: string;
  learning: string;
  relation: string;
  lis: boolean | null;
  braille: boolean | null;
  isDeaf: boolean | null;
  isBlind: boolean | null;
  schoolAreas: {
    humanities: string;
    scientific: string;
    foreignLanguages: string;
    artsMusicSports: string;
    civics: string;
    educationalSupport: string;
  };
  schoolDisciplineDetails?: Record<string, {
    segueProgramma: boolean | null;
    obiettivi: string;
    verificaPrimoQuadrimestre: string;
    verificaSecondoQuadrimestre: string;
  }>;
  schoolObservations: {
    [key: string]: {
      autonomia_igiene: boolean | null;
      autonomia_spazi: boolean | null;
      autonomia_aiuto: boolean | null;
      autonomia_materiale: boolean | null;
      comunicazione_bisogni: boolean | null;
      comunicazione_consegne: boolean | null;
      comunicazione_caa: boolean | null;
      relazionale_comportamento: boolean | null;
      relazionale_regole: boolean | null;
      relazionale_contatto: boolean | null;
      cognitiva_attenzione: boolean | null;
      cognitiva_concentrazione: boolean | null;
      cognitiva_base: boolean | null;
      emotiva_emozioni: boolean | null;
      emotiva_frustrazione: boolean | null;
      emotiva_motivazione: boolean | null;
      emotiva_stereotipie: boolean | null;
    };
  };
  agendaImages: (string | null)[];
  agendaWithWhomImages: (string | null)[];
  agendaHours: (number | null)[];
  agendaHourColors: (string | null)[];
  agendaActivityArchive: string[];
  agendaWhomArchive: string[];
  agendaDurations: number[];
  agendaDay: string;
  agendaWeather: string;
  agendaProgress: number;
  tokenSymbol: string | null;
  tokenArchive: string[];
  tokenRewardImage: string | null;
  tokenRewardOptions: string[];
  agendaObjectives: string[];
  choiceImages: (string | null)[];
  choiceArchivio: string[];
  selectedChoiceIndex: number | null;
  choiceMood: 'happy' | 'sad' | null;
  removedChoices: number[];
  choiceDuration: number;
  choiceLocation: string;
  choiceLocationArchive: string[];
  choiceWithWhom: string;
  choiceWithWhomArchive: string[];
  tokenStepsCount: number;
  tokenStepsStatus?: boolean[];
  autonomyDiary: SubjectSection[];
  relaxArea: SchoolActivity[];
  dailyDiary: { id: string, date: string, image: string, comment: string, translatedComment?: string }[];
  needsChoices: { id: string, label: string, img: string }[];
  feelingsChoices: { id: string, label: string, img: string }[];
  needsTaskAnalysis?: Record<string, { id: string, text: string, done?: boolean }[]>;
  passport: {
    photo: string | null;
    name: string;
    surname: string;
    birthDate: string;
    birthPlace: string;
    residence: string;
    likes: { type: 'text' | 'image', content: string }[];
    dislikes: { type: 'text' | 'image', content: string }[];
    strengths: string[];
    uniqueness: string;
    youtubeLinks: string[];
  };
  schoolDiary: SubjectSection[];
  strengthsPhotos?: string[];
  familyObjectives1?: string;
  familyObjectives2?: string;
  familyObjectives3?: string;
  communication1?: string;
  communication2?: string;
  communication3?: string;
  autonomy1?: string;
  autonomy2?: string;
  autonomy3?: string;
  learning1?: string;
  learning2?: string;
  learning3?: string;
  relation1?: string;
  relation2?: string;
  relation3?: string;
  classTeachers?: {
    id: string;
    name: string;
    subject: string;
    status: 'da_iniziare' | 'in_corso' | 'pronto';
  }[];
  gloDeadlines?: {
    id: string;
    title: string;
    month: string;
    status: 'completato' | 'in_corso' | 'da_pianificare';
    dueDate: string;
  }[];
  didacticObservations?: {
    id: string;
    subject: string;
    pathType: 'A' | 'B' | 'C';
    area: string;
    indicatorsStatus: { [key: string]: 'si' | 'no' | 'in_corso' };
    indicatorsNotes: { [key: string]: string };
    customObjectives?: string;
    assessments?: string;
  }[];
  schoolAppointments?: {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'GLO' | 'Consiglio' | 'Incontro Famiglia' | 'Altro';
    category?: 'scuola-famiglia' | 'team';
    notes?: string;
  }[];
  schoolDocuments?: {
    id: string;
    name: string;
    uploadedAt: string;
    size: string;
    fileType: string;
    category: 'PEI' | 'Verbale' | 'Certificazione' | 'Altro';
    contentUrl?: string;
  }[];
  didacticGeneralObservations?: {
    [key: string]: boolean | null;
  };
}
