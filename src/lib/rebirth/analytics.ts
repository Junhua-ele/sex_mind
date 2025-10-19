// Simple analytics tracking for rebirth feature
// All data stored locally for privacy

interface AnalyticsEvent {
  type: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

const ANALYTICS_KEY = 'rebirth_analytics';
const MAX_EVENTS = 1000;

// Track an event
export function trackEvent(type: string, data?: Record<string, unknown>): void {
  try {
    const events = getEvents();
    const event: AnalyticsEvent = {
      type,
      timestamp: new Date().toISOString(),
      data,
    };

    events.push(event);

    // Keep only recent events
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to track analytics event:', error);
  }
}

// Get all events
function getEvents(): AnalyticsEvent[] {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Get analytics summary
export function getAnalyticsSummary(): {
  totalSessions: number;
  completedSessions: number;
  formAbandonment: {
    atMBTI: number;
    atBirth: number;
    atQuestionnaire: number;
  };
  personaDistribution: Record<string, number>;
  avgMatchScore: number;
} {
  const events = getEvents();

  const startedSessions = events.filter(e => e.type === 'session_started').length;
  const completedSessions = events.filter(e => e.type === 'session_completed').length;

  const abandonedMBTI = events.filter(e => e.type === 'form_abandoned' && e.data?.step === 'mbti').length;
  const abandonedBirth = events.filter(e => e.type === 'form_abandoned' && e.data?.step === 'birth').length;
  const abandonedQuestionnaire = events.filter(e => e.type === 'form_abandoned' && e.data?.step === 'questionnaire').length;

  const personaResults = events.filter(e => e.type === 'result_generated');
  const personaDistribution: Record<string, number> = {};
  let totalScore = 0;

  personaResults.forEach(e => {
    const personaId = e.data?.personaId as string;
    const matchScore = e.data?.matchScore as number;

    if (personaId) {
      personaDistribution[personaId] = (personaDistribution[personaId] || 0) + 1;
    }

    if (matchScore) {
      totalScore += matchScore;
    }
  });

  const avgMatchScore = personaResults.length > 0 ? totalScore / personaResults.length : 0;

  return {
    totalSessions: startedSessions,
    completedSessions,
    formAbandonment: {
      atMBTI: abandonedMBTI,
      atBirth: abandonedBirth,
      atQuestionnaire: abandonedQuestionnaire,
    },
    personaDistribution,
    avgMatchScore,
  };
}

// Clear all analytics data
export function clearAnalytics(): void {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch (error) {
    console.error('Failed to clear analytics:', error);
  }
}

// Export events as JSON
export function exportAnalytics(): string {
  const events = getEvents();
  const summary = getAnalyticsSummary();

  return JSON.stringify({
    summary,
    events,
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

// Predefined event types
export const RebirthEvents = {
  SESSION_STARTED: 'session_started',
  MBTI_COMPLETED: 'mbti_completed',
  MBTI_SKIPPED: 'mbti_skipped',
  BIRTH_INFO_COMPLETED: 'birth_info_completed',
  QUESTIONNAIRE_COMPLETED: 'questionnaire_completed',
  SESSION_COMPLETED: 'session_completed',
  RESULT_GENERATED: 'result_generated',
  RESULT_SHARED: 'result_shared',
  FORM_ABANDONED: 'form_abandoned',
  ERROR_OCCURRED: 'error_occurred',
};
