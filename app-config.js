export const PASSWORD_VALIDATION_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const EMAIL_VALIDATION_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/;
export const PASSWORDS_DO_NOT_MATCH_MESSAGE = "The passwords do not match.";
export const USERNAME_MIN_CHARACTERS = 4;
export const USERNAME_MAX_CHARACTERS = 12;
