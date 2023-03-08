export const PASSWORD_VALIDATION_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export const EMAIL_VALIDATION_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/;
export const USERNAME_VALIDATION_REGEX = /^[a-zA-Z0-9_-]{5,15}$/i;
export const TOPIC_VALIDATION_REGEX = /^[a-zA-Z0-9]*$/;
export const PASSWORDS_DO_NOT_MATCH_MESSAGE = "The passwords do not match.";
export const INVALID_PASSWORD_MESSAGE =
  "The password must be a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number.";
export const INVALID_EMAIL_MESSAGE =
  "The email address is not a valid email address.";
export const INVALID_USERNAME_MESSAGE =
  'The username must be between five and fifteen characters and cannot contain special characters, except for "-" and "_".';
export const MAX_FOLLOWED_TOPICS = 50;
export const MAX_DISPLAYED_TOPICS_IN_MY_TOPIC_INFO = 10;
