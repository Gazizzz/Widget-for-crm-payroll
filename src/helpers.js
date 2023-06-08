import * as dateFns from "date-fns";

const url = new URL(window.location.href);
let strDatefrom = url.searchParams.get("date_from");
let strDateto = url.searchParams.get("date_to");

let today = new Date();

function periodDay() {
  strDatefrom = today;
  strDateto = today;
  let getTimeDayfrom = strDatefrom.getTime();
  let getTimeDayto = strDateto.getTime();
  return [getTimeDayfrom, getTimeDayto];
}

function yesterday() {
  strDatefrom = dateFns.sub(today, { days: 1 });
  strDateto = strDatefrom;
  let getTimeYesterdayFrom = strDatefrom.getTime();
  let getTimeYesterdayTo = strDateto.getTime();
  return [getTimeYesterdayFrom, getTimeYesterdayTo];
}
function startEndWeek() {
  const startEndWeekUS = dateFns.startOfWeek(today);
  strDatefrom = dateFns.add(startEndWeekUS, { days: 1 });
  const lastDayWeekUS = dateFns.lastDayOfWeek(today);
  strDateto = dateFns.add(lastDayWeekUS, { days: 1 });
  let getTimeWeekFrom = strDatefrom.getTime();
  let getTimeWeekTo = strDateto.getTime();
  return [getTimeWeekFrom, getTimeWeekTo];
}

function month() {
  const firstDayMonth = dateFns.startOfMonth(today);
  const lastDayMonth = dateFns.lastDayOfMonth(today);
  strDatefrom = firstDayMonth;

  strDateto = lastDayMonth;
  strDateto.setHours(23);
  strDateto.setMinutes(59);
  strDateto.setSeconds(59);
  let getTimeMonthFrom = strDatefrom.getTime() / 1000;
  // console.log(getTimeMonthFrom);
  let getTimeMonthTo = strDateto.getTime() / 1000;
  return { getTimeMonthFrom, getTimeMonthTo };
}

function getMonthByNumber(monthNumber, year) {
  const dateWithSpecificMonth = dateFns.setMonth(new Date(), monthNumber); // Set the specified month

  const testYear = dateFns.setYear(new Date(dateWithSpecificMonth), year);
  // console.log({ month, monthNumber });
  console.log(testYear);
  const firstDayMonth = dateFns.addDays(dateFns.startOfMonth(testYear), 1);
  const lastDayMonth = dateFns.lastDayOfMonth(testYear);

  strDatefrom = firstDayMonth;
  strDateto = lastDayMonth;
  strDateto.setHours(23);
  strDateto.setMinutes(59);
  strDateto.setSeconds(59);
  let getTimeMonthFrom = strDatefrom.getTime() / 1000;
  console.log(getTimeMonthFrom);
  let getTimeMonthTo = strDateto.getTime() / 1000;
  return {
    getTimeMonthFrom,
    getTimeMonthTo,
  };
}
export {
  periodDay,
  yesterday,
  startEndWeek,
  month,
  getMonthByNumber,
  // getYearByNumber,
};
