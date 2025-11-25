import { Pipe, PipeTransform } from '@angular/core';
import { TimezoneService } from '../Service/timezone.service';

@Pipe({
  name: 'datetimeFormat'
})
export class DatetimeFormatPipe implements PipeTransform {

  constructor(private timezoneService: TimezoneService) {}

  transform(value: any, format: string = 'dd-MM-yyyy HH:mm:ss'): string {
    if (!value) {
      return '-';
    }

    try {
      // If the value is a UTC datetime string, convert it to local timezone and format
      if (typeof value === 'string' && (value.includes('T') || value.includes(' '))) {
        const localDate = this.timezoneService.convertUTCToLocal(value);
        if (localDate) {
          return this.timezoneService.formatLocalDate(localDate, format);
        }
      }
      
      // If it's already a Date object, format it in local timezone
      if (value instanceof Date) {
        return this.timezoneService.formatLocalDate(value, format);
      }

      // If it's a simple date string, try to parse and format
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        return this.timezoneService.formatLocalDate(parsedDate, format);
      }

      return value.toString();
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return value ? value.toString() : '-';
    }
  }
}
