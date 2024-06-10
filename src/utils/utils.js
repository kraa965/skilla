const addZero = (str) => {
  if (str.length < 2) return '0' + str;
  return str;
};

export const getFormatDate = (date) => {
  const str = date.toLocaleString('default', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
  return str[0].toUpperCase() + str.slice(1);
};

export const getHoursMins = (date) => {
  const separate = date.split(' ');
  const res = separate[1].split(':');
  return res[0] + ':' + res[1];
};

export const convertDuration = (seconds) => {
  if (seconds) {
    const min = Math.floor(seconds / 60);
    const sec = min > 0 ? seconds - min * 60 : seconds;
    return `${min}:${addZero(String(sec))}`;
  }
};

export const getDaysDates = (date, numberDays) => {
  const oneDayMs = 24 * 60 * 60 * 1000;

  return {
    start: new Date(date - numberDays * oneDayMs).toLocaleString('en-ca'),
    end: date.toLocaleString('en-ca'),
  };
};

export const getMonthDates = (date) => {
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();
  const startDay = '01';
  const endDay = new Date(year, month, 0).getDate();

  return {
    start: new Date(`${year}-${month}-${startDay}`).toLocaleString('en-ca'),
    end: new Date(`${year}-${month}-${endDay}`).toLocaleString('en-ca'),
  };
};

export const getYearsDates = (date) => {
  const startMonth = '01';
  const endMonth = '12';
  const year = new Date(date).getFullYear();
  const startDay = '01';
  const endDay = new Date(year, 12, 0).getDate();

  return {
    start: new Date(`${year}-${startMonth}-${startDay}`).toLocaleString(
      'en-ca'
    ),
    end: new Date(`${year}-${endMonth}-${endDay}`).toLocaleString('en-ca'),
  };
};
