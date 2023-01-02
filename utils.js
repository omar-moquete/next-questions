import { PASSWORD_VALIDATION_REGEX } from "./app-config";

export const isValidPassword = (password) =>
  password.match(PASSWORD_VALIDATION_REGEX);

export const clearField = (ref) => {
  ref.current.value = "";
  return this;
};
