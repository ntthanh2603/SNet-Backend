export const getTimeAgo = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
  
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (seconds < 60) {
      return 'just now';
    }
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
  
    const days = Math.floor(hours / 24);
    if (days === 1) {
      return 'yesterday';
    }
    if (days < 30) {
      return `${days} days ago`;
    }
  
    const months = Math.floor(days / 30);
    if (months === 1) {
      return 'a month ago';
    }
    if (months < 12) {
      return `${months} months ago`;
    }
  
    const years = Math.floor(months / 12);
    if (years === 1) {
      return 'a year ago';
    }
  
    return `${years} years ago`;
  };