// Types for Past Life Calculator (Rebirth feature)

export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export type FiveElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export interface FiveElementProfile {
  primary: FiveElement;
  supporting: FiveElement[];
}

export interface PersonaEvaluation {
  strengths: string;
  weaknesses: string;
  romance: string;
  wealth: string;
  advice: string;
}

export interface Persona {
  id: string;
  title: string;
  titleZh?: string; // Chinese title
  era: string;
  eraZh?: string; // Chinese era
  region: string;
  regionZh?: string; // Chinese region
  culture: string;
  cultureZh?: string; // Chinese culture
  role: string;
  roleZh?: string; // Chinese role
  mbtiAffinity: MBTIType[];
  fiveElementProfile: FiveElementProfile;
  traits: string[];
  traitsZh?: string[]; // Chinese traits
  storyTemplate: string;
  storyTemplateZh?: string; // Chinese story
  evaluation: PersonaEvaluation;
  evaluationZh?: PersonaEvaluation; // Chinese evaluation
  visualCue: string;
  visualCueZh?: string; // Chinese visual cue
  rarity: number; // 1-5, where 5 is most rare
  hooks: string[];
  hooksZh?: string[]; // Chinese hooks
  balanceNote: string;
  balanceNoteZh?: string; // Chinese balance note
}

export interface BirthInfo {
  date: string; // ISO date string
  time?: string; // HH:mm format
  hasTime: boolean;
  location?: string;
}

export interface QuestionnaireAnswer {
  questionId: string;
  answer: string | number;
  tags: string[]; // Behavioral tags derived from answer
}

export interface RebirthFormData {
  mbti?: MBTIType;
  birthInfo?: BirthInfo;
  questionnaireAnswers: QuestionnaireAnswer[];
}

export interface FiveElementScores {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
}

export interface MatchingResult {
  persona: Persona;
  matchScore: number;
  mbtiMatch: number;
  elementMatch: number;
  behaviorMatch: number;
  reasoning: string[];
}

export interface RebirthSession {
  sessionId: string;
  formData: RebirthFormData;
  result?: MatchingResult;
  createdAt: string;
  completedAt?: string;
}

// Questionnaire structure
export interface QuestionOption {
  value: string | number;
  label: string;
  labelEn: string;
  tags: string[]; // Behavior tags for matching
}

export interface Question {
  id: string;
  text: string;
  textEn: string;
  type: 'single' | 'slider';
  options: QuestionOption[];
  category: string; // For grouping questions
}
