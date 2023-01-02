export const PASSWORD_VALIDATION_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const PASSWORD_INVALID_MESSAGE =
  "The password must have a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number.";
export const PASSWORD_DOES_NOT_MATCH_MESSAGE =
  "The passwords don't match. Please try again.";
