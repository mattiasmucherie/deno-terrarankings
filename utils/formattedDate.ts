export const formattedDate = (date: Date) =>
  new Intl.DateTimeFormat("en-gb", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

export const formattedDateShort = (date: Date) =>
  new Intl.DateTimeFormat("en-gb", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  }).format(date);
