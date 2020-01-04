import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(dueDate, date);
};

export const isOneDay = (dayA, dayB) => {
  return moment(dayA).diff(moment(dayB), `days`) === 0 && dayA.getDate() === dayB.getDate();
};
