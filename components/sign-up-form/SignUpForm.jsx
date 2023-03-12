import React, { useRef, useState, useEffect } from "react";
import CustomField from "../UI/custom-fields/CustomField";
import PrimaryForm from "../UI/forms/PrimaryForm";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import FormMessage from "../UI/forms/form-message/FormMessage";
import {
  EMAIL_VALIDATION_REGEX,
  USERNAME_VALIDATION_REGEX,
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  INVALID_USERNAME_MESSAGE,
  PASSWORDS_DO_NOT_MATCH_MESSAGE,
  PASSWORD_VALIDATION_REGEX,
} from "../../app-config";
import { EXISTS_ENDPOINT } from "../../api-endpoints";
import { clearField, scrollToTop } from "../../utils";
import useAuth from "../../hooks/useAuth";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import EmailIcon from "../UI/svg/EmailIcon";
import UserIcon from "../UI/svg/UserIcon";
import PasswordIcon from "../UI/svg/PasswordIcon";
import { useRouter } from "next/router";

const SignUpForm = function () {
  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const password1InputRef = useRef();
  const password2InputRef = useRef();
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState({
    emailAvailable: null,
    emailValid: false,
    usernameAvailable: null,
    usernameValid: false,
    passwordValid: false,
    passwordsMatch: false,
    data: { email: null, username: null, password1: null, password2: null },
  });
  const [isSubmitting, setIssubmitting] = useState(false);
  const router = useRouter();

  const { createAccount } = useAuth();
  const clearMessage = () => {
    if (message === "") return;
    else setMessage("");
  };

  const validateEmail = async () => {
    // Ensures message is cleared on email field change
    clearMessage();
    const email = emailInputRef.current.value;

    // Ensure test only happens when user finishes typing a correct email address. If user types a valid email address, set emailValid = true
    if (!EMAIL_VALIDATION_REGEX.test(email)) {
      if (formState.emailValid === false) return; // Prevent settin state to false if it's already false
      setFormState((latestState) => {
        // Ensures that a valid email address cannot be an available email address
        return { ...latestState, emailValid: false, emailAvailable: false };
      });
      return;
    } else {
      setFormState((latestState) => {
        return { ...latestState, emailValid: true };
      });
    }

    // Check if email address exists in db.
    try {
      // Ditch api and do checks here... Will update security rules later
      const res = await fetch(EXISTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Check if email exists in collection users, field email
        body: JSON.stringify({
          // What collection
          inCollection: "/users",
          // What field name
          fieldName: "email",
          // What should or should not exist in that fieldName
          exists: email,
          // What is it (constructs error message returned from API)
          type: "email address",
        }),
      });

      const responseData = await res.json();

      if (responseData.found === false) {
        setFormState((latestState) => {
          return { ...latestState, emailAvailable: true };
        });
      } else {
        setFormState((latestState) => {
          return { ...latestState, emailAvailable: false };
        });
        throw new Error(responseData.message);
      }
    } catch (error) {
      scrollToTop();
      setMessage(error.message);
    }
  };

  const validateUsername = async () => {
    // This function is the same as validate email, but for username. See comments on that function for help.
    clearMessage();
    const username = usernameInputRef.current.value;
    if (!USERNAME_VALIDATION_REGEX.test(username)) {
      if (formState.usernameValid === false) return;
      setFormState((latestState) => {
        return {
          ...latestState,
          usernameValid: false,
          usernameAvailable: false,
        };
      });
      return;
    } else {
      setFormState((latestState) => {
        return { ...latestState, usernameValid: true };
      });
    }

    try {
      const res = await fetch(EXISTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inCollection: "/users",
          fieldName: "username",
          exists: username,
          type: "username",
        }),
      });

      const responseData = await res.json();

      if (responseData.found === false) {
        setFormState((latestState) => {
          return { ...latestState, usernameAvailable: true };
        });
      } else {
        setFormState((latestState) => {
          return { ...latestState, usernameAvailable: false };
        });
        throw new Error(responseData.message);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    const email = emailInputRef.current.value;
    const username = usernameInputRef.current.value;
    const password1 = password1InputRef.current.value;
    const password2 = password2InputRef.current.value;

    // check if email is valid
    if (!formState.emailValid) {
      scrollToTop();
      setMessage(INVALID_EMAIL_MESSAGE);
      return;
    }

    // check if username is valid
    if (!formState.usernameValid) {
      scrollToTop();
      setMessage(INVALID_USERNAME_MESSAGE);
      return;
    }
    // Check if password1 is valid
    if (!PASSWORD_VALIDATION_REGEX.test(password1)) {
      // password validation regex here
      scrollToTop();
      setMessage(INVALID_PASSWORD_MESSAGE);
      setFormState({ ...formState, passwordValid: false });
    } else setFormState({ ...formState, passwordValid: true });

    // Check if p2 === p1
    if (password2 !== password1) {
      scrollToTop();
      setMessage(PASSWORDS_DO_NOT_MATCH_MESSAGE);
      setFormState((latestState) => {
        return { ...latestState, passwordsMatch: false };
      });
      clearField(password2InputRef);
    } else
      setFormState((latestState) => {
        return { ...latestState, passwordsMatch: true };
      });

    // If all checks are done, set data in state to be handled by useEffect later.
    setFormState((latestState) => {
      return {
        ...latestState,
        data: { email, username, password1, password2 },
      };
    });
  };

  useEffect(() => {
    // Wrapping functionality in a async IIFE because useEffect does not accept promises as the return value of the callback function passed into it.
    (async function () {
      if (
        !(
          formState.emailAvailable &&
          formState.emailValid &&
          formState.usernameAvailable &&
          formState.usernameValid &&
          formState.passwordValid &&
          formState.passwordsMatch
        )
      )
        return;

      try {
        setIssubmitting(true);
        const userData = await createAccount(
          emailInputRef.current.value,
          password1InputRef.current.value,
          usernameInputRef.current.value
        );
        router.replace(`/${userData.username}`);
      } catch (e) {
        console.error(e);
        scrollToTop();
        setMessage(e.message);
        setIssubmitting(false);
      }
    })();
  }, [formState]);

  return (
    <PrimaryForm onSubmit={submitHandler}>
      <h2>Sign Up</h2>
      <CustomField
        type="email"
        label="Email"
        placeholder="Enter your email"
        inputRef={emailInputRef}
        required
        onChange={validateEmail}
        Icon={EmailIcon}
      />
      <CustomField
        type="text"
        label="Username"
        placeholder="Enter new username"
        inputRef={usernameInputRef}
        required
        onChange={validateUsername}
        Icon={UserIcon}
      />
      <CustomField
        type="password"
        label="Password"
        placeholder="Enter a password"
        inputRef={password1InputRef}
        required
        onChange={clearMessage}
        Icon={PasswordIcon}
      />
      <CustomField
        type="password"
        label="Confirm password"
        placeholder="Enter same password"
        inputRef={password2InputRef}
        required
        onChange={clearMessage}
        Icon={PasswordIcon}
      />

      {isSubmitting ? (
        <InlineSpinner color="#fff" />
      ) : (
        <SecondaryButton>Sign In</SecondaryButton>
      )}

      {message && <FormMessage message={message} onClick={clearMessage} />}
    </PrimaryForm>
  );
};

export default SignUpForm;
