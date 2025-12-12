// Utility functions

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence)}%`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-green-600';
  if (confidence >= 60) return 'text-yellow-600';
  return 'text-orange-600';
}

export function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 80) return 'bg-green-100';
  if (confidence >= 60) return 'bg-yellow-100';
  return 'bg-orange-100';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

