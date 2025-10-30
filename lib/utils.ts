import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a more readable format
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Formatted date like "Oct 27, 2025"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a time string to 12-hour format
 * @param timeString - Time in HH:MM format (24-hour)
 * @returns Formatted time like "7:30 PM"
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date and time together
 * @param dateString - Date in YYYY-MM-DD format
 * @param timeString - Time in HH:MM format
 * @returns Formatted string like "Oct 27, 2025 at 7:30 PM"
 */
export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
}
