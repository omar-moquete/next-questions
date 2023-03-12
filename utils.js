import { PASSWORD_VALIDATION_REGEX, UI_GENERIC_ERROR } from "./app-config";

export const isValidPassword = (password) =>
  password.match(PASSWORD_VALIDATION_REGEX);

export const clearField = (ref) => {
  ref.current.value = "";
  return this;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const toSerializable = (obj) => JSON.parse(JSON.stringify(obj));

export const bindArgs = (fn, ...args) => {
  return () => fn(...args);
};
export const timeAgoFormatter = (value, unit, suffix) => {
  const pluralize = (word) => word + "s";
  if (value < 60 && unit === "second") return "just now";
  return `${value}  ${value > 1 ? pluralize(unit) : unit} ${suffix}`;
};
