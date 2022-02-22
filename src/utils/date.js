import moment from 'moment';

const getDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return { day, month, year };
};

const getTime = (date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return { hour, minute, second };
};

export function setTime(date, dateSet) {
  const { hour, minute, second } = getTime(dateSet);
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(second);
  return date;
}

export function setDate(date, dateSet) {
  const { day, month, year } = getDate(dateSet);
  date.setDate(day);
  date.setMonth(month);
  date.setYear(year);
  return date;
}

export function renderDate(date) {
  const newDate = new Date(date);
  const { hour, minute, second } = getTime(newDate);
  const { day, month, year } = getDate(newDate);

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

export function countTime(date) {
  const distance = new Date(date) - new Date();
  const day = Math.floor(distance / 86400000);
  const hour = Math.floor((distance - day * 86400) / 3600000);
  const minute = Math.floor((distance - day * 86400 - hour * 3600000) / 60000);
  return `${day} day ${hour}h ${minute}m`;
}

export function renderClockTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor(time - hours * 3600 - minutes * 60);

  const hoursString = `0${hours}`.slice(-2);
  const minutesString = `0${minutes}`.slice(-2);
  const secondsString = `0${seconds}`.slice(-2);
  return `${hoursString}:${minutesString}:${secondsString}`;
}

export function checkDate(el) {
  const date = new Date();
  const startTime = new Date(el.startTime);
  const endTime = el.endTime && new Date(el.endTime);
  if (endTime && endTime < date) {
    return 'Ended';
  }
  if (startTime > date) {
    return `Upcoming: ${countTime(startTime)}`;
  }
  return `Time remain: ${moment(startTime).fromNow()}`;
}
