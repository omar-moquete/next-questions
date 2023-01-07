import React, { useRef, useState, useEffect } from "react";
import CustomField from "../UI/custom-field/CustomField";
import classes from "./SignupForm.module.scss";
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
import {
  CREATE_ACCOUNT_ENDPOINT,
  EMAIL_EXISTS_ENDPOINT,
  USERNAME_EXISTS_ENDPOINT,
} from "../../backend-apis";
import { clearField } from "../../utils";

const SignupForm = function () {
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
  const clearMessage = () => {
    if (message === "") return;
    else setMessage("");
  };

  const validateEmail = async () => {
    // Ensures message is cleared on email field change
    clearMessage();
    const email = emailInputRef.current.value;

    // Ensure test only happens when user finishes typing a correct email address. If user types a valid email address, set emailValid = true]
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
      const res = await fetch(EMAIL_EXISTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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
      const res = await fetch(USERNAME_EXISTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
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
      setMessage(INVALID_EMAIL_MESSAGE);
      return;
    }

    // check if username is valid
    if (!formState.usernameValid) {
      setMessage(INVALID_USERNAME_MESSAGE);
      return;
    }
    // Check if password1 is valid
    if (!PASSWORD_VALIDATION_REGEX.test(password1)) {
      // password validation regex here
      setFormState({ ...formState, passwordValid: false });
      setMessage(INVALID_PASSWORD_MESSAGE);
    } else setFormState({ ...formState, passwordValid: true });

    // Check if p2 === p1
    if (password2 !== password1) {
      setFormState((latestState) => {
        return { ...latestState, passwordsMatch: false };
      });
      clearField(password2InputRef);
      setMessage(PASSWORDS_DO_NOT_MATCH_MESSAGE);
    } else
      setFormState((latestState) => {
        return { ...latestState, passwordsMatch: true };
      });

    // If all checks are done, set data in state to be handled by usedEffect later.
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
        await fetch(CREATE_ACCOUNT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState.data),
        });
      } catch (e) {
        console.log(e);
        setMessage(e.message);
      }
    })();
  }, [formState]);

  return (
    <PrimaryForm className={classes.form} onSubmit={submitHandler}>
      <h2>User signup</h2>
      <CustomField
        type="email"
        label="Email"
        placeholder="Enter your email"
        inputRef={emailInputRef}
        required
        onChange={validateEmail}
      />
      <CustomField
        type="text"
        label="Username"
        placeholder="Enter new username"
        inputRef={usernameInputRef}
        required
        onChange={validateUsername}
      />
      <CustomField
        type="password"
        label="Password"
        placeholder="Enter a password"
        inputRef={password1InputRef}
        required
        onChange={clearMessage}
      />
      <CustomField
        type="password"
        label="Confirm password"
        placeholder="Enter same password"
        inputRef={password2InputRef}
        required
        onChange={clearMessage}
      />
      <SecondaryButton className={classes.btn}>Signup</SecondaryButton>

      {message && <FormMessage message={message} />}
    </PrimaryForm>
  );
};

export default SignupForm;
