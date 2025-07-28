export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'przed chwilą';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${getPluralForm(diffInMinutes, 'minuta', 'minuty', 'minut')} temu`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${getPluralForm(diffInHours, 'godzina', 'godziny', 'godzin')} temu`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${getPluralForm(diffInDays, 'dzień', 'dni', 'dni')} temu`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${getPluralForm(diffInWeeks, 'tydzień', 'tygodnie', 'tygodni')} temu`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${getPluralForm(diffInMonths, 'miesiąc', 'miesiące', 'miesięcy')} temu`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${getPluralForm(diffInYears, 'rok', 'lata', 'lat')} temu`;
}

// Helper function for Polish plural forms
function getPluralForm(count: number, form1: string, form2: string, form5: string): string {
  if (count === 1) {
    return form1;
  }
  
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    return form2;
  }
  
  return form5;
}