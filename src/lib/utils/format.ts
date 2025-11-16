/**
 * Format number as currency with commas
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

/**
 * Validate battle price (must be divisible by 1000)
 */
export function validateBattlePrice(price: number): boolean {
  return price > 0 && price % 1000 === 0;
}

/**
 * Get battle type icon
 */
export function getBattleTypeIcon(battleType: 'Battle' | 'Kill List'): string {
  return battleType === 'Battle' ? '⚔️' : '🎯';
}

/**
 * Get result color class
 */
export function getResultColor(result: 'WIN' | 'LOSE'): string {
  return result === 'WIN' ? 'text-battle-gold' : 'text-battle-crimson';
}