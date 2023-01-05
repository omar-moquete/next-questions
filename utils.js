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
  const words = errorString.split("/")[1].split("-");

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
