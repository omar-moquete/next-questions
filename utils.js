import { PASSWORD_VALIDATION_REGEX } from "./app-config";

export const isValidPassword = (password) =>
  password.match(PASSWORD_VALIDATION_REGEX);

export const clearField = (ref) => {
  ref.current.value = "";
  return this;
};

export const formatFirebaseErrorCode = function (errorString) {
  // Initial errorString format: firebaseService/error-message-no-spaces

  // Remove "/" and "-"s
  const words = errorString.split("/")[1].split(")")[0].split("-");

  // Get word to capitalize
  const firstWord = words[0];

  // Capitalize word
  const capitalizedFirstWord = [
    firstWord[0].toUpperCase(),
    firstWord.substring(1),
  ].join("");

  // Array of all the words with first word capitalized.
  const capitalizedSentenceArray = [capitalizedFirstWord, ...words.slice(1)];

  // Add period to end of sentence.
  const formattedWords = capitalizedSentenceArray.join(" ") + ".";

  return formattedWords;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const convertDate = function (
  unixTimestamp,
  options = {
    dateStyle: "full",
    timeStyle: "full",
  }
) {
  const date = new Date(unixTimestamp * 1000);
  const intl = new Intl.DateTimeFormat("en-US", options);

  return intl.format(date);
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
