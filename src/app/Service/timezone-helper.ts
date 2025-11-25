import { TimezoneService } from './timezone.service';

/**
 * Helper class with static methods for common timezone operations
 * This provides a convenient way to use timezone conversions without injecting the service
 */
export class TimezoneHelper {
  private static timezoneService: TimezoneService;

  /**
   * Initialize the helper with timezone service instance
   * Call this in your app module or component constructor
   */
  static initialize(service: TimezoneService): void {
    TimezoneHelper.timezoneService = service;
  }

  /**
   * Convert local date to IST for API submission
   * @param localDate - Date in user's local timezone
   * @returns Date string in IST format (YYYY-MM-DD)
   */
  static toIST(localDate: Date | string): string {
    if (!TimezoneHelper.timezoneService) {
      throw new Error('TimezoneHelper not initialized. Call TimezoneHelper.initialize() first.');
    }
    return TimezoneHelper.timezoneService.convertLocalToIST(localDate);
  }

  /**
   * Convert UTC date to local timezone for display
   * @param utcDate - Date in UTC format from API
   * @returns Date object in user's local timezone
   */
  static fromUTC(utcDate: string | Date): Date | null {
    if (!TimezoneHelper.timezoneService) {
      throw new Error('TimezoneHelper not initialized. Call TimezoneHelper.initialize() first.');
    }
    return TimezoneHelper.timezoneService.convertUTCToLocal(utcDate);
  }

  /**
   * Convert IST date to local timezone for display
   * @param istDate - Date in IST format from API
   * @returns Date object in user's local timezone
   */
  static fromIST(istDate: string | Date): Date | null {
    if (!TimezoneHelper.timezoneService) {
      throw new Error('TimezoneHelper not initialized. Call TimezoneHelper.initialize() first.');
    }
    return TimezoneHelper.timezoneService.convertISTToLocal(istDate);
  }

  /**
   * Format date for display in local timezone
   * @param date - Date to format
   * @param format - Format string (default: 'DD-MM-YYYY')
   * @returns Formatted date string
   */
  static formatLocal(date: Date | string, format?: string): string {
    if (!TimezoneHelper.timezoneService) {
      throw new Error('TimezoneHelper not initialized. Call TimezoneHelper.initialize() first.');
    }
    return TimezoneHelper.timezoneService.formatLocalDate(date, format);
  }

  /**
   * Get current date in IST
   * @returns Current date in IST format (YYYY-MM-DD)
   */
  static nowIST(): string {
    if (!TimezoneHelper.timezoneService) {
      throw new Error('TimezoneHelper not initialized. Call TimezoneHelper.initialize() first.');
    }
    return TimezoneHelper.timezoneService.getCurrentISTDate();
  }

  /**
   * Get current date in local timezone
   * @returns Current date in local timezone
   */
  static nowLocal(): Date {
    if (!TimezoneHelper.timezoneService) {
      throw new Error('TimezoneHelper not initialized. Call TimezoneHelper.initialize() first.');
    }
    return TimezoneHelper.timezoneService.getCurrentLocalDate();
  }
}
