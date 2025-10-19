// Past Life Calculator - Matching Algorithm
import type {
  Persona,
  RebirthFormData,
  MatchingResult,
  FiveElementScores,
  MBTIType,
  FiveElement,
} from './types';
import personasData from '@/data/personas.json';

const personas = personasData as Persona[];

// MBTI compatibility matrix (simple similarity scoring)
const MBTI_COMPATIBILITY: Record<MBTIType, Partial<Record<MBTIType, number>>> = {
  // Analysts
  INTJ: { INTJ: 1.0, INTP: 0.9, ENTJ: 0.85, ENTP: 0.8, INFJ: 0.75, ENFJ: 0.7 },
  INTP: { INTP: 1.0, INTJ: 0.9, ENTP: 0.85, ENTJ: 0.8, INFP: 0.75, ENFP: 0.7 },
  ENTJ: { ENTJ: 1.0, INTJ: 0.85, ENTP: 0.8, INTP: 0.8, ENFJ: 0.75, INFJ: 0.7 },
  ENTP: { ENTP: 1.0, INTP: 0.85, ENTJ: 0.8, INTJ: 0.8, ENFP: 0.75, INFP: 0.7 },
  // Diplomats
  INFJ: { INFJ: 1.0, ENFJ: 0.9, INFP: 0.85, ENFP: 0.8, INTJ: 0.75, ENTJ: 0.7 },
  INFP: { INFP: 1.0, ENFP: 0.9, INFJ: 0.85, ENFJ: 0.8, INTP: 0.75, ENTP: 0.7 },
  ENFJ: { ENFJ: 1.0, INFJ: 0.9, ENFP: 0.85, INFP: 0.8, ENTJ: 0.75, INTJ: 0.7 },
  ENFP: { ENFP: 1.0, INFP: 0.9, ENFJ: 0.85, INFJ: 0.8, ENTP: 0.75, INTP: 0.7 },
  // Sentinels
  ISTJ: { ISTJ: 1.0, ESTJ: 0.9, ISFJ: 0.85, ESFJ: 0.8, INTJ: 0.7, ENTJ: 0.65 },
  ISFJ: { ISFJ: 1.0, ESFJ: 0.9, ISTJ: 0.85, ESTJ: 0.8, INFJ: 0.7, ENFJ: 0.65 },
  ESTJ: { ESTJ: 1.0, ISTJ: 0.9, ESFJ: 0.85, ISFJ: 0.8, ENTJ: 0.75, INTJ: 0.7 },
  ESFJ: { ESFJ: 1.0, ISFJ: 0.9, ESTJ: 0.85, ISTJ: 0.8, ENFJ: 0.75, INFJ: 0.7 },
  // Explorers
  ISTP: { ISTP: 1.0, ESTP: 0.9, ISFP: 0.85, ESFP: 0.8, INTP: 0.75, ENTP: 0.7 },
  ISFP: { ISFP: 1.0, ESFP: 0.9, ISTP: 0.85, ESTP: 0.8, INFP: 0.75, ENFP: 0.7 },
  ESTP: { ESTP: 1.0, ISTP: 0.9, ESFP: 0.85, ISFP: 0.8, ENTP: 0.75, INTP: 0.7 },
  ESFP: { ESFP: 1.0, ISFP: 0.9, ESTP: 0.85, ISTP: 0.8, ENFP: 0.75, INFP: 0.7 },
};

// Five Elements birth year calculation (simplified Chinese astrology)
// Based on Heavenly Stems cycle
function calculateFiveElementFromBirthYear(date: string): FiveElement {
  const year = new Date(date).getFullYear();
  const stemIndex = (year - 4) % 10; // Heavenly Stems cycle

  // Heavenly Stems to Five Elements mapping
  const stemToElement: FiveElement[] = [
    'Metal', 'Metal', // 0-1: Geng, Xin
    'Water', 'Water', // 2-3: Ren, Gui
    'Wood', 'Wood',   // 4-5: Jia, Yi
    'Fire', 'Fire',   // 6-7: Bing, Ding
    'Earth', 'Earth', // 8-9: Wu, Ji
  ];

  return stemToElement[stemIndex];
}

// Calculate Five Element scores from questionnaire tags
function calculateFiveElementScores(formData: RebirthFormData): FiveElementScores {
  const scores: FiveElementScores = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  // Add weight from questionnaire tags
  formData.questionnaireAnswers.forEach(answer => {
    answer.tags.forEach(tag => {
      if (tag === 'Wood' || tag === 'Fire' || tag === 'Earth' || tag === 'Metal' || tag === 'Water') {
        scores[tag as FiveElement] += 1;
      }
    });
  });

  // Add weight from birth year if available
  if (formData.birthInfo?.date) {
    const birthElement = calculateFiveElementFromBirthYear(formData.birthInfo.date);
    scores[birthElement] += 3; // Birth year element has more weight
  }

  // Normalize scores to 0-1 range
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
  if (total > 0) {
    (Object.keys(scores) as FiveElement[]).forEach(element => {
      scores[element] = scores[element] / total;
    });
  }

  return scores;
}

// Calculate MBTI match score
function calculateMBTIMatch(userMBTI: MBTIType | undefined, persona: Persona): number {
  if (!userMBTI) return 0.5; // Neutral score if no MBTI provided

  // Check if user's MBTI is in persona's affinity list
  if (persona.mbtiAffinity.includes(userMBTI)) {
    return 1.0; // Perfect match
  }

  // Use compatibility matrix
  const compatibility = MBTI_COMPATIBILITY[userMBTI]?.[persona.mbtiAffinity[0]];
  if (compatibility) {
    return compatibility;
  }

  // Check for shared cognitive functions (simplified)
  const userFunctions = userMBTI.split('');
  let sharedFunctions = 0;
  persona.mbtiAffinity.forEach(affinity => {
    const affinityFunctions = affinity.split('');
    for (let i = 0; i < 4; i++) {
      if (userFunctions[i] === affinityFunctions[i]) {
        sharedFunctions++;
      }
    }
  });

  return (sharedFunctions / 4) * 0.7; // Max 0.7 for partial matches
}

// Calculate Five Element match score
function calculateElementMatch(userScores: FiveElementScores, persona: Persona): number {
  const primary = persona.fiveElementProfile.primary;
  const supporting = persona.fiveElementProfile.supporting;

  let score = userScores[primary] * 2; // Primary element has double weight

  supporting.forEach(element => {
    score += userScores[element];
  });

  // Normalize (max possible: 2 + supporting.length)
  const maxScore = 2 + supporting.length;
  return score / maxScore;
}

// Calculate behavioral match score from questionnaire tags
function calculateBehaviorMatch(formData: RebirthFormData, persona: Persona): number {
  const userTags = formData.questionnaireAnswers.flatMap(a =>
    a.tags.filter(t => !['Wood', 'Fire', 'Earth', 'Metal', 'Water'].includes(t))
  );

  const personaTraits = persona.traits;
  const personaRole = persona.role.toLowerCase();

  let matches = 0;
  let total = userTags.length;

  userTags.forEach(tag => {
    // Check if tag appears in persona traits
    const tagLower = tag.toLowerCase();
    if (personaTraits.some(trait => trait.toLowerCase().includes(tagLower) || tagLower.includes(trait.toLowerCase()))) {
      matches += 1;
    }
    // Check against role
    if (personaRole.includes(tagLower) || tagLower.includes(personaRole)) {
      matches += 0.5;
    }
  });

  return total > 0 ? Math.min(matches / total, 1.0) : 0.5;
}

// Main matching function
export function calculateMatch(formData: RebirthFormData): MatchingResult {
  const elementScores = calculateFiveElementScores(formData);

  // Calculate match score for each persona
  const matches = personas.map(persona => {
    const mbtiScore = calculateMBTIMatch(formData.mbti, persona);
    const elementScore = calculateElementMatch(elementScores, persona);
    const behaviorScore = calculateBehaviorMatch(formData, persona);

    // Weighted combination
    const matchScore = (
      mbtiScore * 0.35 +          // 35% MBTI
      elementScore * 0.40 +       // 40% Five Elements
      behaviorScore * 0.25        // 25% Behavioral traits
    ) * 100;

    // Apply rarity modifier (rare personas slightly less likely)
    const rarityModifier = 1 - (persona.rarity / 100);
    const finalScore = matchScore * rarityModifier;

    return {
      persona,
      matchScore: Math.round(finalScore * 100) / 100,
      mbtiMatch: Math.round(mbtiScore * 100),
      elementMatch: Math.round(elementScore * 100),
      behaviorMatch: Math.round(behaviorScore * 100),
      reasoning: generateReasoning(formData, persona, mbtiScore, elementScore, behaviorScore),
    };
  });

  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);

  // Add some randomness among top matches for variety
  const topMatches = matches.slice(0, 5);
  const randomIndex = Math.floor(Math.random() * Math.min(3, topMatches.length));

  return topMatches[randomIndex];
}

// Generate reasoning for the match
function generateReasoning(
  formData: RebirthFormData,
  persona: Persona,
  mbtiScore: number,
  elementScore: number,
  behaviorScore: number
): string[] {
  const reasons: string[] = [];

  // MBTI reasoning
  if (formData.mbti && mbtiScore > 0.8) {
    if (persona.mbtiAffinity.includes(formData.mbti)) {
      reasons.push(`Your ${formData.mbti} personality resonates perfectly with this past life.`);
    } else {
      reasons.push(`Your ${formData.mbti} traits align well with the ${persona.role} archetype.`);
    }
  }

  // Element reasoning
  if (elementScore > 0.7) {
    const primary = persona.fiveElementProfile.primary;
    reasons.push(`Your ${primary} element energy strongly connects to this identity.`);
  }

  // Behavioral reasoning
  if (behaviorScore > 0.6) {
    const commonTraits = formData.questionnaireAnswers
      .flatMap(a => a.tags)
      .filter(tag => persona.traits.some(t => t.toLowerCase().includes(tag.toLowerCase())))
      .slice(0, 2);

    if (commonTraits.length > 0) {
      reasons.push(`Your ${commonTraits.join(' and ')} nature reflects this soul's journey.`);
    }
  }

  // Era/culture connection
  reasons.push(`The ${persona.culture} era shaped a spirit that mirrors your inner world.`);

  // Add persona-specific hook
  if (persona.hooks.length > 0) {
    reasons.push(persona.hooks[Math.floor(Math.random() * persona.hooks.length)]);
  }

  return reasons;
}

// Get all personas (for browsing)
export function getAllPersonas(): Persona[] {
  return personas;
}

// Get persona by ID
export function getPersonaById(id: string): Persona | undefined {
  return personas.find(p => p.id === id);
}

// Get random persona
export function getRandomPersona(): Persona {
  return personas[Math.floor(Math.random() * personas.length)];
}

// Calculate element compatibility percentage
export function getElementCompatibility(element1: FiveElement, element2: FiveElement): number {
  // Five Elements generation and control cycles
  const generation: Record<FiveElement, FiveElement> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood',
  };

  const control: Record<FiveElement, FiveElement> = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood',
  };

  if (element1 === element2) return 100; // Same element
  if (generation[element1] === element2) return 85; // Generative relationship
  if (generation[element2] === element1) return 75; // Being generated
  if (control[element1] === element2) return 40; // Controlling
  if (control[element2] === element1) return 35; // Being controlled

  return 50; // Neutral
}
