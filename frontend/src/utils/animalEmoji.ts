export function getAnimalEmoji(type: string | null | undefined): string {
  const lower = (type ?? '').toLowerCase();
  if (lower === 'dog') return '🐕';
  if (lower === 'cat') return '🐈';
  return '🐾';
}
