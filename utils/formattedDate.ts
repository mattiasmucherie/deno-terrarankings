export const formattedDate = (date: Date) =>
  new Intl.DateTimeFormat("en-gb", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
