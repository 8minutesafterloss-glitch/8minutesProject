import { useHomeContent } from '@/hooks/useHomeContent';

const DEFAULTS = {
  enabled: true,
  targetDate: '2026-10-15T00:00',
  interimEnabled: false,
  interimEndDate: '',
  openedText: 'נפתח',
  clickable: false,
  link: '',
  artistPageBlockUntil: '',
};

export function useCountdownSettings() {
  const { content } = useHomeContent();
  const raw = content?.countdown_settings;
  if (!raw) return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export { DEFAULTS };