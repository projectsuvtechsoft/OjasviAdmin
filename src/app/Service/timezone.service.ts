import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  
  // IST timezone offset (UTC + 5:30)
  private readonly IST_OFFSET = '+05:30';
  
  constructor() { }

  /**
   * Convert a date from user's local timezone to IST for API submission
   * @param localDate - Date in user's local timezone
   * @returns Date string in IST (YYYY-MM-DD format)
   */
  convertLocalToIST(localDate: Date | string): string {
    if (!localDate) return '';
    
    // Create moment object from local date
    const localMoment = moment(localDate);
    
    // Convert to IST
    const istMoment = localMoment.utcOffset(this.IST_OFFSET);
    
    // Return in YYYY-MM-DD format for API
    return istMoment.format('YYYY-MM-DD');
  }

  /**
   * Convert a date from UTC (received from API) to user's local timezone for display
   * @param utcDate - Date in UTC format from API
   * @returns Date object in user's local timezone
   */
  convertUTCToLocal(utcDate: string | Date): Date | null {
    if (!utcDate) return null;
    
    // Parse as UTC and convert to local timezone
    const utcMoment = moment.utc(utcDate);
    const localMoment = utcMoment.local();
    
    return localMoment.toDate();
  }

  /**
   * Convert IST date (from API) to user's local timezone for display
   * @param istDate - Date in IST format from API
   * @returns Date object in user's local timezone
   */
  convertISTToLocal(istDate: string | Date): Date | null {
    if (!istDate) return null;
    
    // Parse the date as IST
    const istMoment = moment.tz(istDate, 'Asia/Kolkata');
    const localMoment = istMoment.local();
    
    return localMoment.toDate();
  }

  /**
   * Get current date in user's local timezone
   * @returns Current date in local timezone
   */
  getCurrentLocalDate(): Date {
    return moment().toDate();
  }

  /**
   * Get current date in IST format
   */
  getCurrentISTDate(): string {
    return moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
  }

  /**
   * Convert local date to IST with proper time component
   * @param localDate - Date in user's local timezone
   * @returns IST date with time in 'YYYY-MM-DD HH:mm:ss' format
   */
  convertLocalToISTWithTime(localDate: Date | string): string {
    if (!localDate) return '';
    
    try {
      // Convert the local date to IST with current time
      const istMoment = moment(localDate).tz('Asia/Kolkata');
      return istMoment.format('YYYY-MM-DD HH:mm:ss');
    } catch (error) {
      console.error('Error converting local date to IST with time:', error);
      return '';
    }
  }

  /**
   * Format date for display in local timezone
   * @param date - Date to format
   * @param format - Moment.js format string (default: 'DD-MM-YYYY HH:mm:ss')
   * @returns Formatted date string
   */
  formatLocalDate(date: Date | string, format: string = 'DD-MM-YYYY HH:mm:ss'): string {
    if (!date) return '';
    
    const localMoment = moment(date);
    return localMoment.format(format);
  }

  /**
   * Check if a date is valid
   * @param date - Date to validate
   * @returns Boolean indicating if date is valid
   */
  isValidDate(date: any): boolean {
    return moment(date).isValid();
  }

  /**
   * Get timezone offset for user's local timezone
   * @returns Timezone offset in minutes
   */
  getLocalTimezoneOffset(): number {
    return moment().utcOffset();
  }

  /**
   * Get timezone name for user's local timezone
   * @returns Timezone name (e.g., 'America/New_York')
   */
  getLocalTimezoneName(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}
