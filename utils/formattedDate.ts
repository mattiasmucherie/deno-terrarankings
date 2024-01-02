export const formattedDate = (date: Date, lang = "en-gb") =>
  new Intl.DateTimeFormat(lang, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

export const formattedDateShort = (date: Date, lang = "en-gb") =>
  new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  }).format(date);
