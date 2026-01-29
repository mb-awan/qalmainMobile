import moment from 'moment';

declare module 'moment' {
  interface Moment {
    iYear(): number;
    iYear(year: number): Moment;
    iMonth(): number;
    iMonth(month: number): Moment;
    iDate(): number;
    iDate(date: number): Moment;
  }
}

declare module 'moment-hijri' {
  export = moment;
}
