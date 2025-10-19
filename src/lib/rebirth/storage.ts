// Storage utilities for Past Life Calculator (Rebirth feature)
import type { RebirthSession, RebirthFormData, MatchingResult } from './types';

const STORAGE_KEY_PREFIX = 'rebirth_';
const SESSION_KEY = `${STORAGE_KEY_PREFIX}current_session`;
const HISTORY_KEY = `${STORAGE_KEY_PREFIX}history`;
const MAX_HISTORY = 10; // Keep last 10 sessions

// Generate unique session ID
export function generateSessionId(): string {
  return `${STORAGE_KEY_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Save current session to localStorage
export function saveCurrentSession(formData: RebirthFormData, sessionId?: string): string {
  const id = sessionId || generateSessionId();
  const session: RebirthSession = {
    sessionId: id,
    formData,
    createdAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return id;
  } catch (error) {
    console.error('Failed to save rebirth session:', error);
    return id;
  }
}

// Get current session from localStorage
export function getCurrentSession(): RebirthSession | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    return JSON.parse(data) as RebirthSession;
  } catch (error) {
    console.error('Failed to load rebirth session:', error);
    return null;
  }
}

// Complete session with result
export function completeSession(result: MatchingResult): void {
  const session = getCurrentSession();
  if (!session) {
    console.warn('No active session to complete');
    return;
  }

  session.result = result;
  session.completedAt = new Date().toISOString();

  try {
    // Save updated current session
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Add to history
    addToHistory(session);
  } catch (error) {
    console.error('Failed to complete rebirth session:', error);
  }
}

// Add session to history
function addToHistory(session: RebirthSession): void {
  try {
    const historyData = localStorage.getItem(HISTORY_KEY);
    let history: RebirthSession[] = historyData ? JSON.parse(historyData) : [];

    // Add new session
    history.unshift(session);

    // Keep only MAX_HISTORY sessions
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to add session to history:', error);
  }
}

// Get session history
export function getSessionHistory(): RebirthSession[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data) as RebirthSession[];
  } catch (error) {
    console.error('Failed to load session history:', error);
    return [];
  }
}

// Get specific session by ID
export function getSessionById(sessionId: string): RebirthSession | null {
  const history = getSessionHistory();
  return history.find(s => s.sessionId === sessionId) || null;
}

// Clear current session
export function clearCurrentSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear current session:', error);
  }
}

// Clear all rebirth data
export function clearAllRebirthData(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear rebirth data:', error);
  }
}

// Export session data (anonymized)
export function exportSessionData(sessionId: string): string {
  const session = getSessionById(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  // Create anonymized export
  const exportData = {
    sessionId: session.sessionId,
    mbti: session.formData.mbti,
    birthYear: session.formData.birthInfo?.date ? new Date(session.formData.birthInfo.date).getFullYear() : null,
    hasTime: session.formData.birthInfo?.hasTime,
    questionnaireTagsSummary: session.formData.questionnaireAnswers.flatMap(a => a.tags),
    result: session.result ? {
      personaId: session.result.persona.id,
      personaTitle: session.result.persona.title,
      matchScore: session.result.matchScore,
    } : null,
    completedAt: session.completedAt,
  };

  return JSON.stringify(exportData, null, 2);
}

// Check if storage is available
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Get storage usage info
export function getStorageInfo(): { used: number; total: number; percentage: number } {
  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Convert to KB
    const usedKB = used / 1024;
    const totalKB = 5120; // 5MB typical limit
    const percentage = (usedKB / totalKB) * 100;

    return {
      used: Math.round(usedKB * 100) / 100,
      total: totalKB,
      percentage: Math.round(percentage * 100) / 100,
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return { used: 0, total: 5120, percentage: 0 };
  }
}
